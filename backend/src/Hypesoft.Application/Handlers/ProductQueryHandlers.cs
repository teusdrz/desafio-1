using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class ProductQueryHandlers :
    IRequestHandler<GetProductByIdQuery, ProductDto?>,
    IRequestHandler<GetAllProductsQuery, IEnumerable<ProductDto>>,
    IRequestHandler<GetProductsPaginatedQuery, ProductListDto>,
    IRequestHandler<SearchProductsByNameQuery, IEnumerable<ProductDto>>,
    IRequestHandler<GetProductsByCategoryQuery, IEnumerable<ProductDto>>,
    IRequestHandler<GetLowStockProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;
    private readonly ILogger<ProductQueryHandlers> _logger;

    private const int CacheExpirationMinutes = 10;
    private const string ProductCacheKeyPrefix = "product:";
    private const string ProductListCacheKey = "products:all";
    private const string LowStockCacheKey = "products:lowstock";

    public ProductQueryHandlers(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper,
        IDistributedCache cache,
        ILogger<ProductQueryHandlers> logger)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
        _cache = cache;
        _logger = logger;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"{ProductCacheKeyPrefix}{request.Id}";

        // Try to get from cache first
        var cachedProduct = await _cache.GetStringAsync(cacheKey, cancellationToken);
        if (!string.IsNullOrEmpty(cachedProduct))
        {
            _logger.LogInformation("Product {ProductId} retrieved from cache", request.Id);
            return JsonSerializer.Deserialize<ProductDto>(cachedProduct);
        }

        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
            return null;

        var productDto = _mapper.Map<ProductDto>(product);

        if (!string.IsNullOrEmpty(product.CategoryId))
        {
            var category = await _categoryRepository.GetByIdAsync(product.CategoryId, cancellationToken);
            productDto.CategoryName = category?.Name ?? string.Empty;
        }

        // Cache the result
        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CacheExpirationMinutes)
        };

        var serializedProduct = JsonSerializer.Serialize(productDto);
        await _cache.SetStringAsync(cacheKey, serializedProduct, cacheOptions, cancellationToken);

        _logger.LogInformation("Product {ProductId} cached for {Minutes} minutes", request.Id, CacheExpirationMinutes);

        return productDto;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        // Try to get from cache first
        var cachedProducts = await _cache.GetStringAsync(ProductListCacheKey, cancellationToken);
        if (!string.IsNullOrEmpty(cachedProducts))
        {
            _logger.LogInformation("All products retrieved from cache");
            return JsonSerializer.Deserialize<IEnumerable<ProductDto>>(cachedProducts) ?? new List<ProductDto>();
        }

        var products = await _productRepository.GetAllAsync(cancellationToken);
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        // Cache the result
        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CacheExpirationMinutes)
        };

        var serializedProducts = JsonSerializer.Serialize(productDtos);
        await _cache.SetStringAsync(ProductListCacheKey, serializedProducts, cacheOptions, cancellationToken);

        _logger.LogInformation("All products cached for {Minutes} minutes", CacheExpirationMinutes);

        return productDtos;
    }

    public async Task<ProductListDto> Handle(GetProductsPaginatedQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.Page;
        var pageSize = request.PageSize;

        var (products, totalCount) = await _productRepository.GetPaginatedAsync(
            pageNumber,
            pageSize,
            request.SearchTerm,
            request.CategoryId,
            null, // minPrice
            null, // maxPrice
            null, // lowStockOnly
            "Name", // sortBy
            "asc", // sortDirection
            cancellationToken);

        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        return new ProductListDto
        {
            Products = productDtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / request.PageSize)
        };
    }

    public async Task<IEnumerable<ProductDto>> Handle(SearchProductsByNameQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.SearchByNameAsync(request.Name, cancellationToken);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetProductsByCategoryQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetByCategoryIdAsync(request.CategoryId, cancellationToken);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetLowStockProductsAsync(request.Threshold, cancellationToken);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}
