using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

/// <summary>
/// Repository interface for Product aggregate with advanced querying capabilities.
/// Provides methods for complex queries, pagination, and performance-optimized operations.
/// </summary>
public interface IProductRepository : IBaseRepository<Product>
{
    /// <summary>
    /// Gets products by category identifier.
    /// </summary>
    /// <param name="categoryId">The category identifier.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A collection of products in the specified category.</returns>
    Task<IEnumerable<Product>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches products by name using full-text search.
    /// </summary>
    /// <param name="name">The search term for product name.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A collection of products matching the search term.</returns>
    Task<IEnumerable<Product>> SearchByNameAsync(string name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets products with stock below the specified threshold.
    /// </summary>
    /// <param name="threshold">The stock threshold (default: 10).</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A collection of low stock products.</returns>
    Task<IEnumerable<Product>> GetLowStockProductsAsync(int threshold = 10, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated products with advanced filtering and sorting options.
    /// </summary>
    /// <param name="pageNumber">The page number (1-based).</param>
    /// <param name="pageSize">The number of items per page.</param>
    /// <param name="searchTerm">Optional search term for name/description.</param>
    /// <param name="categoryId">Optional category filter.</param>
    /// <param name="minPrice">Optional minimum price filter.</param>
    /// <param name="maxPrice">Optional maximum price filter.</param>
    /// <param name="lowStockOnly">Optional filter for low stock products only.</param>
    /// <param name="sortBy">The field to sort by (default: Name).</param>
    /// <param name="sortDirection">The sort direction (asc/desc).</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing the products and total count.</returns>
    Task<(IEnumerable<Product> Products, int TotalCount)> GetPaginatedAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        string? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool? lowStockOnly = null,
        string sortBy = "Name",
        string sortDirection = "asc",
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the total value of all products in stock.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The total stock value.</returns>
    Task<decimal> GetTotalStockValueAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the count of products per category.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A dictionary with category names and product counts.</returns>
    Task<Dictionary<string, int>> GetCategoriesCountAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the minimum and maximum price range across all products.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A tuple containing the minimum and maximum prices.</returns>
    Task<(decimal min, decimal max)> GetPriceRangeAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets products that are trending based on recent activity.
    /// </summary>
    /// <param name="limit">The number of trending products to return.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A collection of trending products.</returns>
    Task<IEnumerable<Product>> GetTrendingProductsAsync(int limit = 10, CancellationToken cancellationToken = default);

    /// <summary>
    /// Bulk updates stock quantities for multiple products.
    /// </summary>
    /// <param name="stockUpdates">Dictionary of product IDs and new stock quantities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task BulkUpdateStockAsync(Dictionary<string, int> stockUpdates, CancellationToken cancellationToken = default);
}
