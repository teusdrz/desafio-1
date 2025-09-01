using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface IProductRepository : IBaseRepository<Product>
{
    Task<IEnumerable<Product>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> SearchByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetLowStockProductsAsync(int threshold = 10, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Product> Products, int TotalCount)> GetPaginatedAsync(
        int skip,
        int take,
        string? searchTerm = null,
        string? categoryId = null,
        string? sortBy = null,
        bool sortDescending = false,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool? lowStockOnly = null,
        CancellationToken cancellationToken = default);
    Task<decimal> GetTotalStockValueAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> GetCategoriesCountAsync(CancellationToken cancellationToken = default);
    Task<(decimal min, decimal max)> GetPriceRangeAsync(CancellationToken cancellationToken = default);
}
