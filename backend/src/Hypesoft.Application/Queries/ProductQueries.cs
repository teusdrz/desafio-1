using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries;

public class GetProductByIdQuery : IRequest<ProductDto?>
{
    public string Id { get; set; } = string.Empty;
}

public class GetAllProductsQuery : IRequest<IEnumerable<ProductDto>>
{
}

public class GetProductsPaginatedQuery : IRequest<ProductListDto>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? CategoryId { get; set; }
    public string? SortBy { get; set; } = "Name"; // Name, Price, CreatedAt, StockQuantity
    public bool SortDescending { get; set; } = false;
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? LowStockOnly { get; set; }

    public int Skip => (Page - 1) * PageSize;
    public int Take => PageSize > 100 ? 100 : PageSize; // Limit max page size to 100
}

public class SearchProductsByNameQuery : IRequest<IEnumerable<ProductDto>>
{
    public string Name { get; set; } = string.Empty;
}

public class GetProductsByCategoryQuery : IRequest<IEnumerable<ProductDto>>
{
    public string CategoryId { get; set; } = string.Empty;
}

public class GetLowStockProductsQuery : IRequest<IEnumerable<ProductDto>>
{
    public int Threshold { get; set; } = 10;
}
