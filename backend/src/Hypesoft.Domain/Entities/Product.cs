using Hypesoft.Domain.ValueObjects;
using Hypesoft.Domain.DomainEvents;

namespace Hypesoft.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public Price Price { get; private set; } = null!;
    public string CategoryId { get; private set; } = string.Empty;
    public Category Category { get; private set; } = null!;
    public StockQuantity StockQuantity { get; private set; } = null!;
    public bool IsLowStock => StockQuantity.Value < 10;

    private Product() { }

    public static Product Create(
        string name,
        string description,
        decimal price,
        string categoryId,
        int stockQuantity)
    {
        var product = new Product
        {
            Name = name,
            Description = description,
            Price = Price.Create(price),
            CategoryId = categoryId,
            StockQuantity = StockQuantity.Create(stockQuantity)
        };

        // Add domain event
        product.AddDomainEvent(new ProductCreatedEvent(
            product.Id,
            name,
            price,
            categoryId,
            stockQuantity));

        return product;
    }

    public void UpdateBasicInfo(string name, string description, decimal price)
    {
        Name = name;
        Description = description;
        Price = Price.Create(price);
        MarkAsModified();

        // Add domain event
        AddDomainEvent(new ProductUpdatedEvent(Id, name, price, CategoryId));
    }

    public void UpdateStock(int quantity)
    {
        var previousStock = StockQuantity.Value;
        StockQuantity = StockQuantity.Create(quantity);
        MarkAsModified();

        // Add domain event
        AddDomainEvent(new ProductStockUpdatedEvent(Id, previousStock, quantity, IsLowStock));

        // Check for low stock
        if (IsLowStock)
        {
            AddDomainEvent(new LowStockDetectedEvent(Id, Name, quantity));
        }
    }

    public void UpdateCategory(string categoryId)
    {
        if (string.IsNullOrWhiteSpace(categoryId))
            throw new ArgumentException("Category ID cannot be null or empty", nameof(categoryId));

        CategoryId = categoryId;
        MarkAsModified();

        // Add domain event
        AddDomainEvent(new ProductUpdatedEvent(Id, Name, Price.Value, categoryId));
    }

    public void ReduceStock(int quantity)
    {
        if (StockQuantity.Value < quantity)
            throw new InvalidOperationException("Insufficient stock quantity");

        StockQuantity = StockQuantity.Create(StockQuantity.Value - quantity);
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncreaseStock(int quantity)
    {
        StockQuantity = StockQuantity.Create(StockQuantity.Value + quantity);
        UpdatedAt = DateTime.UtcNow;
    }
}
