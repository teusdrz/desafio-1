namespace Hypesoft.Application.Common.Models;

/// <summary>
/// Represents a paginated result set for query operations.
/// Provides metadata about pagination and the requested data.
/// </summary>
/// <typeparam name="T">The type of items in the result.</typeparam>
public class PaginatedResult<T>
{
    /// <summary>
    /// Gets the list of items for the current page.
    /// </summary>
    public IReadOnlyList<T> Items { get; }

    /// <summary>
    /// Gets the current page number (1-based).
    /// </summary>
    public int PageNumber { get; }

    /// <summary>
    /// Gets the number of items per page.
    /// </summary>
    public int PageSize { get; }

    /// <summary>
    /// Gets the total number of items across all pages.
    /// </summary>
    public int TotalCount { get; }

    /// <summary>
    /// Gets the total number of pages.
    /// </summary>
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);

    /// <summary>
    /// Gets a value indicating whether there is a previous page.
    /// </summary>
    public bool HasPreviousPage => PageNumber > 1;

    /// <summary>
    /// Gets a value indicating whether there is a next page.
    /// </summary>
    public bool HasNextPage => PageNumber < TotalPages;

    /// <summary>
    /// Initializes a new instance of the <see cref="PaginatedResult{T}"/> class.
    /// </summary>
    /// <param name="items">The items for the current page.</param>
    /// <param name="totalCount">The total number of items.</param>
    /// <param name="pageNumber">The current page number.</param>
    /// <param name="pageSize">The number of items per page.</param>
    public PaginatedResult(IReadOnlyList<T> items, int totalCount, int pageNumber, int pageSize)
    {
        Items = items ?? throw new ArgumentNullException(nameof(items));
        TotalCount = totalCount;
        PageNumber = pageNumber;
        PageSize = pageSize;
    }

    /// <summary>
    /// Creates an empty paginated result.
    /// </summary>
    /// <param name="pageNumber">The current page number.</param>
    /// <param name="pageSize">The number of items per page.</param>
    /// <returns>An empty paginated result.</returns>
    public static PaginatedResult<T> Empty(int pageNumber, int pageSize)
    {
        return new PaginatedResult<T>(Array.Empty<T>(), 0, pageNumber, pageSize);
    }
}
