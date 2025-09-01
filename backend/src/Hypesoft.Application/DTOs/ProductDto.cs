namespace Hypesoft.Application.DTOs;

public class ProductDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public bool IsLowStock { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
}

public class UpdateProductStockDto
{
    public int StockQuantity { get; set; }
}

public class ProductListDto
{
    public IEnumerable<ProductDto> Products { get; set; } = Enumerable.Empty<ProductDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
    public string? SearchTerm { get; set; }
    public string? CategoryId { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
    public ProductListMetadataDto Metadata { get; set; } = new();
}

public class ProductListMetadataDto
{
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int LowStockCount { get; set; }
    public int TotalCategories { get; set; }
    public Dictionary<string, int> CategoriesCount { get; set; } = new();
}
