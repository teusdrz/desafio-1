using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using Hypesoft.Application.Common.Models;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers.Queries;

/// <summary>
/// Handler for processing paginated product queries with caching and performance optimization.
/// Implements advanced CQRS read-side patterns with caching strategies.
/// </summary>
public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PaginatedResult<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetProductsQueryHandler> _logger;
    private readonly IDistributedCache _cache;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetProductsQueryHandler"/> class.
    /// </summary>
    /// <param name="productRepository">The product repository.</param>
    /// <param name="mapper">The object mapper.</param>
    /// <param name="logger">The logger.</param>
    /// <param name="cache">The distributed cache.</param>
    public GetProductsQueryHandler(
        IProductRepository productRepository,
        IMapper mapper,
        ILogger<GetProductsQueryHandler> logger,
        IDistributedCache cache)
    {
        _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    /// <summary>
    /// Handles the get products query with caching and performance optimization.
    /// </summary>
    /// <param name="request">The query request.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A paginated result of products.</returns>
    /// <exception cref="ArgumentException">Thrown when query parameters are invalid.</exception>
    public async Task<PaginatedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing GetProductsQuery with page {PageNumber}, size {PageSize}, search term '{SearchTerm}'",
            request.PageNumber, request.PageSize, request.SearchTerm);

        // Validate query parameters
        if (!request.IsValid())
        {
            _logger.LogWarning("Invalid query parameters: {@Request}", request);
            throw new ArgumentException("Invalid query parameters");
        }

        try
        {
            // Generate cache key based on query parameters
            var cacheKey = GenerateCacheKey(request);

            // Try to get from cache first
            var cachedResult = await GetFromCacheAsync(cacheKey, cancellationToken);
            if (cachedResult != null)
            {
                _logger.LogInformation("Returning cached result for key {CacheKey}", cacheKey);
                return cachedResult;
            }

            // Query the database with optimized parameters
            var (products, totalCount) = await _productRepository.GetPaginatedAsync(
                request.PageNumber,
                request.PageSize,
                request.SearchTerm,
                request.CategoryId,
                request.MinPrice,
                request.MaxPrice,
                request.LowStockOnly,
                request.SortBy,
                request.SortDirection,
                cancellationToken);

            // Map to DTOs
            var productDtos = _mapper.Map<List<ProductDto>>(products);

            // Create paginated result
            var result = new PaginatedResult<ProductDto>(
                productDtos,
                totalCount,
                request.PageNumber,
                request.PageSize);

            // Cache the result for future requests
            await CacheResultAsync(cacheKey, result, cancellationToken);

            _logger.LogInformation("Successfully processed GetProductsQuery. Returned {Count} products out of {Total}",
                productDtos.Count, totalCount);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing GetProductsQuery: {@Request}", request);
            throw;
        }
    }

    /// <summary>
    /// Generates a cache key based on the query parameters.
    /// </summary>
    /// <param name="request">The query request.</param>
    /// <returns>A unique cache key.</returns>
    private static string GenerateCacheKey(GetProductsQuery request)
    {
        var keyComponents = new[]
        {
            "products",
            $"page:{request.PageNumber}",
            $"size:{request.PageSize}",
            $"search:{request.SearchTerm ?? "null"}",
            $"category:{request.CategoryId ?? "null"}",
            $"minPrice:{request.MinPrice?.ToString() ?? "null"}",
            $"maxPrice:{request.MaxPrice?.ToString() ?? "null"}",
            $"lowStock:{request.LowStockOnly?.ToString() ?? "null"}",
            $"sortBy:{request.SortBy}",
            $"sortDir:{request.SortDirection}"
        };

        return string.Join(":", keyComponents);
    }

    /// <summary>
    /// Attempts to retrieve the result from cache.
    /// </summary>
    /// <param name="cacheKey">The cache key.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The cached result or null if not found.</returns>
    private async Task<PaginatedResult<ProductDto>?> GetFromCacheAsync(string cacheKey, CancellationToken cancellationToken)
    {
        try
        {
            var cachedBytes = await _cache.GetAsync(cacheKey, cancellationToken);
            if (cachedBytes != null)
            {
                var cachedJson = System.Text.Encoding.UTF8.GetString(cachedBytes);
                return JsonSerializer.Deserialize<PaginatedResult<ProductDto>>(cachedJson);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to retrieve from cache with key {CacheKey}", cacheKey);
        }

        return null;
    }

    /// <summary>
    /// Caches the result for future requests.
    /// </summary>
    /// <param name="cacheKey">The cache key.</param>
    /// <param name="result">The result to cache.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    private async Task CacheResultAsync(string cacheKey, PaginatedResult<ProductDto> result, CancellationToken cancellationToken)
    {
        try
        {
            var json = JsonSerializer.Serialize(result);
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);

            var options = new DistributedCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(15), // Cache for 15 minutes
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1) // Absolute expiry after 1 hour
            };

            await _cache.SetAsync(cacheKey, bytes, options, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to cache result with key {CacheKey}", cacheKey);
        }
    }
}
