using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Commands;

public class CreateProductCommand : IRequest<ProductDto>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}

public class UpdateProductCommand : IRequest<ProductDto>
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
}

public class UpdateProductStockCommand : IRequest<ProductDto>
{
    public string Id { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}

public class DeleteProductCommand : IRequest<bool>
{
    public string Id { get; set; } = string.Empty;
}
