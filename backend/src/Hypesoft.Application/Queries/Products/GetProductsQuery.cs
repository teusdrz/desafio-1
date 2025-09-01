using MediatR;
using Hypesoft.Application.Common.Models;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries.Products;

/// <summary>
/// Query to get paginated products with optional filtering and sorting.
/// Implements the Query side of CQRS pattern for optimized read operations.
/// </summary>
public record GetProductsQuery : IRequest<PaginatedResult<ProductDto>>
{
    /// <summary>
    /// Gets the page number (1-based).
    /// </summary>
    public int PageNumber { get; init; } = 1;

    /// <summary>
    /// Gets the number of items per page.
    /// </summary>
    public int PageSize { get; init; } = 10;

    /// <summary>
    /// Gets the search term for filtering products by name or description.
    /// </summary>
    public string? SearchTerm { get; init; }

    /// <summary>
    /// Gets the category ID for filtering products by category.
    /// </summary>
    public string? CategoryId { get; init; }

    /// <summary>
    /// Gets the minimum price for price range filtering.
    /// </summary>
    public decimal? MinPrice { get; init; }

    /// <summary>
    /// Gets the maximum price for price range filtering.
    /// </summary>
    public decimal? MaxPrice { get; init; }

    /// <summary>
    /// Gets a value indicating whether to include only low stock products.
    /// </summary>
    public bool? LowStockOnly { get; init; }

    /// <summary>
    /// Gets the field to sort by.
    /// </summary>
    public string SortBy { get; init; } = "Name";

    /// <summary>
    /// Gets the sort direction (asc or desc).
    /// </summary>
    public string SortDirection { get; init; } = "asc";

    /// <summary>
    /// Validates the query parameters.
    /// </summary>
    /// <returns>True if valid, otherwise false.</returns>
    public bool IsValid()
    {
        return PageNumber > 0 &&
               PageSize > 0 &&
               PageSize <= 100 &&
               (MinPrice == null || MinPrice >= 0) &&
               (MaxPrice == null || MaxPrice >= 0) &&
               (MinPrice == null || MaxPrice == null || MinPrice <= MaxPrice);
    }
}
