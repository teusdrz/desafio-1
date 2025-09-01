using Hypesoft.Domain.ValueObjects;
using Hypesoft.Domain.DomainEvents;
using Hypesoft.Domain.Common;

namespace Hypesoft.Domain.Entities;

/// <summary>
/// Product aggregate root that encapsulates product business logic and invariants.
/// Ensures consistency and publishes domain events for side effects.
/// </summary>
public class Product : AggregateRoot
{
    /// <summary>
    /// Gets the name of the product.
    /// </summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>
    /// Gets the description of the product.
    /// </summary>
    public string Description { get; private set; } = string.Empty;

    /// <summary>
    /// Gets the price of the product as a value object.
    /// </summary>
    public Price Price { get; private set; } = null!;

    /// <summary>
    /// Gets the category identifier this product belongs to.
    /// </summary>
    public string CategoryId { get; private set; } = string.Empty;

    /// <summary>
    /// Gets the category navigation property.
    /// </summary>
    public Category Category { get; private set; } = null!;

    /// <summary>
    /// Gets the stock quantity as a value object.
    /// </summary>
    public StockQuantity StockQuantity { get; private set; } = null!;

    /// <summary>
    /// Gets a value indicating whether the product has low stock (below threshold).
    /// </summary>
    public bool IsLowStock => StockQuantity.Value < LowStockThreshold;

    /// <summary>
    /// Gets the minimum stock threshold for low stock alerts.
    /// </summary>
    public const int LowStockThreshold = 10;

    /// <summary>
    /// Gets a value indicating whether the product is deleted (soft delete).
    /// </summary>
    public bool IsDeleted { get; private set; }

    /// <summary>
    /// Gets or sets the unique identifier of the product.
    /// </summary>
    public override string Id { get; protected set; } = Guid.NewGuid().ToString();

    private Product() { }

    /// <summary>
    /// Creates a new product with the specified parameters.
    /// </summary>
    /// <param name="name">The name of the product.</param>
    /// <param name="description">The description of the product.</param>
    /// <param name="price">The price of the product.</param>
    /// <param name="categoryId">The category identifier.</param>
    /// <param name="stockQuantity">The initial stock quantity.</param>
    /// <returns>A new product instance.</returns>
    /// <exception cref="ArgumentException">Thrown when required parameters are invalid.</exception>
    public static Product Create(
        string name,
        string description,
        decimal price,
        string categoryId,
        int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name cannot be empty", nameof(name));

        if (string.IsNullOrWhiteSpace(categoryId))
            throw new ArgumentException("Category ID cannot be empty", nameof(categoryId));

        var product = new Product
        {
            Name = name,
            Description = description,
            Price = Price.Create(price),
            CategoryId = categoryId,
            StockQuantity = StockQuantity.Create(stockQuantity)
        };

        // Publish domain event for product creation
        product.AddDomainEvent(new ProductCreatedDomainEvent(
            product.Id,
            name,
            price,
            categoryId,
            stockQuantity));

        return product;
    }

    /// <summary>
    /// Updates the basic information of the product.
    /// </summary>
    /// <param name="name">The new name of the product.</param>
    /// <param name="description">The new description of the product.</param>
    /// <param name="price">The new price of the product.</param>
    /// <exception cref="ArgumentException">Thrown when required parameters are invalid.</exception>
    public void UpdateBasicInfo(string name, string description, decimal price)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name cannot be empty", nameof(name));

        Name = name;
        Description = description;
        Price = Price.Create(price);
        MarkAsUpdated();
    }

    /// <summary>
    /// Updates the stock quantity of the product and publishes relevant domain events.
    /// </summary>
    /// <param name="newQuantity">The new stock quantity.</param>
    /// <exception cref="ArgumentException">Thrown when the quantity is negative.</exception>
    public void UpdateStock(int newQuantity)
    {
        if (newQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(newQuantity));

        var previousQuantity = StockQuantity.Value;
        StockQuantity = StockQuantity.Create(newQuantity);
        MarkAsUpdated();

        // Check if stock has fallen below threshold
        if (newQuantity < LowStockThreshold && previousQuantity >= LowStockThreshold)
        {
            AddDomainEvent(new LowStockDomainEvent(
                Id,
                Name,
                newQuantity,
                LowStockThreshold));
        }
    }

    /// <summary>
    /// Decreases the stock quantity by the specified amount.
    /// </summary>
    /// <param name="quantity">The quantity to decrease.</param>
    /// <exception cref="InvalidOperationException">Thrown when there's insufficient stock.</exception>
    public void DecreaseStock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        if (StockQuantity.Value < quantity)
            throw new InvalidOperationException($"Insufficient stock. Available: {StockQuantity.Value}, Requested: {quantity}");

        UpdateStock(StockQuantity.Value - quantity);
    }

    /// <summary>
    /// Increases the stock quantity by the specified amount.
    /// </summary>
    /// <param name="quantity">The quantity to increase.</param>
    /// <exception cref="ArgumentException">Thrown when the quantity is not positive.</exception>
    public void IncreaseStock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        UpdateStock(StockQuantity.Value + quantity);
    }

    /// <summary>
    /// Updates the category of the product.
    /// </summary>
    /// <param name="categoryId">The new category identifier.</param>
    /// <exception cref="ArgumentException">Thrown when the category ID is null or empty.</exception>
    public void UpdateCategory(string categoryId)
    {
        if (string.IsNullOrWhiteSpace(categoryId))
            throw new ArgumentException("Category ID cannot be null or empty", nameof(categoryId));

        CategoryId = categoryId;
        MarkAsUpdated();
    }

    /// <summary>
    /// Marks the product as deleted (soft delete).
    /// </summary>
    public void Delete()
    {
        IsDeleted = true;
        MarkAsUpdated();
    }
}
