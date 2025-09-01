using Microsoft.EntityFrameworkCore;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;

namespace Hypesoft.Infrastructure.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> SearchByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Where(p => p.Name.Contains(name))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetLowStockProductsAsync(int threshold = 10, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Where(p => p.StockQuantity.Value < threshold)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Product> Products, int TotalCount)> GetPaginatedAsync(
        int skip,
        int take,
        string? searchTerm = null,
        string? categoryId = null,
        string? sortBy = null,
        bool sortDescending = false,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool? lowStockOnly = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Include(p => p.Category).AsQueryable();

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
            query = query.Where(p => p.StockQuantity.Value < 10);
        }

        // Sorting
        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "name" => sortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                "price" => sortDescending ? query.OrderByDescending(p => p.Price.Value) : query.OrderBy(p => p.Price.Value),
                "stock" => sortDescending ? query.OrderByDescending(p => p.StockQuantity.Value) : query.OrderBy(p => p.StockQuantity.Value),
                "createdat" => sortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
                _ => query.OrderBy(p => p.Name)
            };
        }
        else
        {
            query = query.OrderBy(p => p.Name);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var products = await query
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);

        return (products, totalCount);
    }

    public async Task<Dictionary<string, int>> GetCategoriesCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted)
            .GroupBy(p => p.Category!.Name)
            .Select(g => new { CategoryName = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.CategoryName, x => x.Count, cancellationToken);
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

    public async Task<decimal> GetTotalStockValueAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => !p.IsDeleted)
            .SumAsync(p => p.Price.Value * p.StockQuantity.Value, cancellationToken);
    }

    public override async Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<Product>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Category)
            .ToListAsync(cancellationToken);
    }
}
