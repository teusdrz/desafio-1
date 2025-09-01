using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;

namespace Hypesoft.Infrastructure.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    private readonly ILogger<ProductRepository> _logger;

    public ProductRepository(ApplicationDbContext context, ILogger<ProductRepository> logger) : base(context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId && !p.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> SearchByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Enumerable.Empty<Product>();

        return await _dbSet
            .Include(p => p.Category)
            .Where(p => p.Name.Contains(name) && !p.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetLowStockProductsAsync(int threshold = 10, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Where(p => p.StockQuantity.Value <= threshold && !p.IsDeleted)
            .OrderBy(p => p.StockQuantity.Value)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Product> Products, int TotalCount)> GetPaginatedAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        string? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool? lowStockOnly = null,
        string sortBy = "Name",
        string sortDirection = "asc",
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Include(p => p.Category).Where(p => !p.IsDeleted);

        // Apply filters
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm));
        }

        if (!string.IsNullOrEmpty(categoryId))
        {
            query = query.Where(p => p.CategoryId == categoryId);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price.Value >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price.Value <= maxPrice.Value);
        }

        if (lowStockOnly.HasValue && lowStockOnly.Value)
        {
            query = query.Where(p => p.StockQuantity.Value <= 10);
        }

        // Apply sorting
        var isDescending = sortDirection.Equals("desc", StringComparison.OrdinalIgnoreCase);
        query = sortBy.ToLower() switch
        {
            "name" => isDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "price" => isDescending ? query.OrderByDescending(p => p.Price.Value) : query.OrderBy(p => p.Price.Value),
            "stockquantity" => isDescending ? query.OrderByDescending(p => p.StockQuantity.Value) : query.OrderBy(p => p.StockQuantity.Value),
            "createdat" => isDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
            _ => query.OrderBy(p => p.Name)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var skip = (pageNumber - 1) * pageSize;
        var products = await query
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (products, totalCount);
    }

    public async Task<decimal> GetTotalStockValueAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => !p.IsDeleted && p.StockQuantity.Value > 0)
            .SumAsync(p => p.Price.Value * p.StockQuantity.Value, cancellationToken);
    }

    public async Task<Dictionary<string, int>> GetCategoriesCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => !p.IsDeleted)
            .GroupBy(p => p.CategoryId)
            .Select(g => new { CategoryId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.CategoryId, x => x.Count, cancellationToken);
    }

    public async Task<(decimal min, decimal max)> GetPriceRangeAsync(CancellationToken cancellationToken = default)
    {
        var products = await _dbSet
            .Where(p => !p.IsDeleted)
            .Select(p => p.Price.Value)
            .ToListAsync(cancellationToken);

        if (!products.Any())
            return (0, 0);

        return (products.Min(), products.Max());
    }

    public async Task<IEnumerable<Product>> GetTrendingProductsAsync(int limit = 10, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }

    public async Task BulkUpdateStockAsync(Dictionary<string, int> stockUpdates, CancellationToken cancellationToken = default)
    {
        var productIds = stockUpdates.Keys.ToList();
        var products = await _dbSet
            .Where(p => productIds.Contains(p.Id) && !p.IsDeleted)
            .ToListAsync(cancellationToken);

        foreach (var product in products)
        {
            if (stockUpdates.TryGetValue(product.Id, out var newStock))
            {
                product.UpdateStock(newStock);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
