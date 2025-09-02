using Hypesoft.Application.DTOs;

namespace Hypesoft.API.GraphQL.Types;

// Input types for mutations
public class CreateProductInput
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string CategoryId { get; set; } = string.Empty;
}

public class UpdateProductInput
{
    public string Id { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? StockQuantity { get; set; }
    public string? CategoryId { get; set; }
}

public class CreateCategoryInput
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateCategoryInput
{
    public string Id { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Description { get; set; }
}

// Payload types for mutations
public class ProductPayload
{
    public ProductDto? Product { get; set; }
    public string? ErrorMessage { get; set; }
    public bool Success => Product != null && string.IsNullOrEmpty(ErrorMessage);
}

public class CategoryPayload
{
    public CategoryDto? Category { get; set; }
    public string? ErrorMessage { get; set; }
    public bool Success => Category != null && string.IsNullOrEmpty(ErrorMessage);
}

public class DeletePayload
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public string? DeletedId { get; set; }
}
