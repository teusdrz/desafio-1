using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class ProductCommandHandlers :
    IRequestHandler<CreateProductCommand, ProductDto>,
    IRequestHandler<UpdateProductCommand, ProductDto>,
    IRequestHandler<UpdateProductStockCommand, ProductDto>,
    IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;
    private readonly ILogger<ProductCommandHandlers> _logger;

    private const string ProductCacheKeyPrefix = "product:";
    private const string ProductListCacheKey = "products:all";
    private const string LowStockCacheKey = "products:lowstock";

    public ProductCommandHandlers(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper,
        IDistributedCache cache,
        ILogger<ProductCommandHandlers> logger)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
        _cache = cache;
        _logger = logger;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category == null)
            throw new ArgumentException($"Category with ID {request.CategoryId} not found");

        var product = Product.Create(
            request.Name,
            request.Description,
            request.Price,
            request.CategoryId,
            request.StockQuantity);

        await _productRepository.AddAsync(product, cancellationToken);

        // Invalidate cache for lists (new product added)
        await InvalidateListCacheAsync(cancellationToken);

        var productDto = _mapper.Map<ProductDto>(product);
        productDto.CategoryName = category.Name;

        return productDto;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
            throw new ArgumentException($"Product with ID {request.Id} not found");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category == null)
            throw new ArgumentException($"Category with ID {request.CategoryId} not found");

        product.UpdateBasicInfo(request.Name, request.Description, request.Price);
        product.UpdateCategory(request.CategoryId);

        await _productRepository.UpdateAsync(product, cancellationToken);

        // Invalidate cache
        await InvalidateProductCacheAsync(product.Id, cancellationToken);

        var productDto = _mapper.Map<ProductDto>(product);
        productDto.CategoryName = category.Name;

        return productDto;
    }

    public async Task<ProductDto> Handle(UpdateProductStockCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
            throw new ArgumentException($"Product with ID {request.Id} not found");

        product.UpdateStock(request.StockQuantity);
        await _productRepository.UpdateAsync(product, cancellationToken);

        // Invalidate cache
        await InvalidateProductCacheAsync(product.Id, cancellationToken);

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var exists = await _productRepository.ExistsAsync(request.Id, cancellationToken);
        if (!exists)
            return false;

        await _productRepository.DeleteAsync(request.Id, cancellationToken);

        // Invalidate cache
        await InvalidateProductCacheAsync(request.Id, cancellationToken);

        return true;
    }

    private async Task InvalidateProductCacheAsync(string productId, CancellationToken cancellationToken)
    {
        try
        {
            // Remove specific product from cache
            var productCacheKey = $"{ProductCacheKeyPrefix}{productId}";
            await _cache.RemoveAsync(productCacheKey, cancellationToken);

            // Remove related cache entries
            await InvalidateListCacheAsync(cancellationToken);

            _logger.LogInformation("Cache invalidated for product {ProductId}", productId);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to invalidate cache for product {ProductId}", productId);
            // Don't throw - cache invalidation failure shouldn't break the operation
        }
    }

    private async Task InvalidateListCacheAsync(CancellationToken cancellationToken)
    {
        try
        {
            await _cache.RemoveAsync(ProductListCacheKey, cancellationToken);
            await _cache.RemoveAsync(LowStockCacheKey, cancellationToken);

            _logger.LogInformation("Product list caches invalidated");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to invalidate product list caches");
        }
    }
}
