using FluentAssertions;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.ValueObjects;
using Hypesoft.Domain.DomainEvents;

namespace Hypesoft.UnitTests.Domain.Entities;

/// <summary>
/// Comprehensive tests for Product aggregate root including domain events and business logic.
/// </summary>
public class ProductAggregateTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateProductAndRaiseDomainEvent()
    {
        // Arrange
        var name = "Test Product";
        var description = "Test Description";
        var price = 100.50m;
        var categoryId = "cat123";
        var stockQuantity = 25;

        // Act
        var product = Product.Create(name, description, price, categoryId, stockQuantity);

        // Assert
        product.Should().NotBeNull();
        product.Id.Should().NotBeNullOrEmpty();
        product.Name.Should().Be(name);
        product.Description.Should().Be(description);
        product.Price.Value.Should().Be(price);
        product.CategoryId.Should().Be(categoryId);
        product.StockQuantity.Value.Should().Be(stockQuantity);
        product.IsLowStock.Should().BeFalse();

        // Verify domain event was raised
        product.DomainEvents.Should().HaveCount(1);
        var domainEvent = product.DomainEvents.First();
        domainEvent.Should().BeOfType<ProductCreatedDomainEvent>();

        var productCreatedEvent = (ProductCreatedDomainEvent)domainEvent;
        productCreatedEvent.ProductId.Should().Be(product.Id);
        productCreatedEvent.ProductName.Should().Be(name);
        productCreatedEvent.Price.Should().Be(price);
        productCreatedEvent.CategoryId.Should().Be(categoryId);
        productCreatedEvent.StockQuantity.Should().Be(stockQuantity);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Create_WithInvalidName_ShouldThrowArgumentException(string invalidName)
    {
        // Act & Assert
        FluentActions.Invoking(() => Product.Create(invalidName, "Description", 100m, "cat1", 10))
            .Should().Throw<ArgumentException>()
            .WithMessage("Product name cannot be empty*");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Create_WithInvalidCategoryId_ShouldThrowArgumentException(string invalidCategoryId)
    {
        // Act & Assert
        FluentActions.Invoking(() => Product.Create("Product", "Description", 100m, invalidCategoryId, 10))
            .Should().Throw<ArgumentException>()
            .WithMessage("Category ID cannot be empty*");
    }

    [Fact]
    public void UpdateStock_ToLowStock_ShouldRaiseLowStockEvent()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 50);
        product.ClearDomainEvents(); // Clear creation event

        // Act - Update to low stock
        product.UpdateStock(5);

        // Assert
        product.StockQuantity.Value.Should().Be(5);
        product.IsLowStock.Should().BeTrue();

        // Verify low stock event was raised
        product.DomainEvents.Should().HaveCount(1);
        var domainEvent = product.DomainEvents.First();
        domainEvent.Should().BeOfType<LowStockDomainEvent>();

        var lowStockEvent = (LowStockDomainEvent)domainEvent;
        lowStockEvent.ProductId.Should().Be(product.Id);
        lowStockEvent.ProductName.Should().Be("Test Product");
        lowStockEvent.CurrentStock.Should().Be(5);
        lowStockEvent.MinimumThreshold.Should().Be(Product.LowStockThreshold);
    }

    [Fact]
    public void UpdateStock_FromLowToNormalStock_ShouldNotRaiseLowStockEvent()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 5);
        product.ClearDomainEvents(); // Clear creation event

        // Act - Update from low to normal stock
        product.UpdateStock(15);

        // Assert
        product.StockQuantity.Value.Should().Be(15);
        product.IsLowStock.Should().BeFalse();

        // Verify no additional events were raised
        product.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void UpdateStock_WithNegativeQuantity_ShouldThrowArgumentException()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 10);

        // Act & Assert
        FluentActions.Invoking(() => product.UpdateStock(-1))
            .Should().Throw<ArgumentException>()
            .WithMessage("Stock quantity cannot be negative*");
    }

    [Fact]
    public void DecreaseStock_WithSufficientStock_ShouldUpdateQuantity()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 20);
        var initialStock = product.StockQuantity.Value;

        // Act
        product.DecreaseStock(5);

        // Assert
        product.StockQuantity.Value.Should().Be(initialStock - 5);
    }

    [Fact]
    public void DecreaseStock_WithInsufficientStock_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 5);

        // Act & Assert
        FluentActions.Invoking(() => product.DecreaseStock(10))
            .Should().Throw<InvalidOperationException>()
            .WithMessage("Insufficient stock. Available: 5, Requested: 10");
    }

    [Fact]
    public void DecreaseStock_WithZeroOrNegativeQuantity_ShouldThrowArgumentException()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 10);

        // Act & Assert
        FluentActions.Invoking(() => product.DecreaseStock(0))
            .Should().Throw<ArgumentException>()
            .WithMessage("Quantity must be positive*");

        FluentActions.Invoking(() => product.DecreaseStock(-5))
            .Should().Throw<ArgumentException>()
            .WithMessage("Quantity must be positive*");
    }

    [Fact]
    public void IncreaseStock_WithValidQuantity_ShouldUpdateQuantity()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 10);
        var initialStock = product.StockQuantity.Value;

        // Act
        product.IncreaseStock(5);

        // Assert
        product.StockQuantity.Value.Should().Be(initialStock + 5);
    }

    [Fact]
    public void IncreaseStock_WithZeroOrNegativeQuantity_ShouldThrowArgumentException()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 10);

        // Act & Assert
        FluentActions.Invoking(() => product.IncreaseStock(0))
            .Should().Throw<ArgumentException>()
            .WithMessage("Quantity must be positive*");

        FluentActions.Invoking(() => product.IncreaseStock(-5))
            .Should().Throw<ArgumentException>()
            .WithMessage("Quantity must be positive*");
    }

    [Fact]
    public void UpdateBasicInfo_WithValidData_ShouldUpdateProperties()
    {
        // Arrange
        var product = Product.Create("Original", "Original Description", 50m, "cat1", 10);
        var originalVersion = product.Version;

        // Act
        product.UpdateBasicInfo("Updated Name", "Updated Description", 75m);

        // Assert
        product.Name.Should().Be("Updated Name");
        product.Description.Should().Be("Updated Description");
        product.Price.Value.Should().Be(75m);
        product.Version.Should().Be(originalVersion + 1);
        product.UpdatedAt.Should().BeAfter(product.CreatedAt);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void UpdateBasicInfo_WithInvalidName_ShouldThrowArgumentException(string invalidName)
    {
        // Arrange
        var product = Product.Create("Original", "Original Description", 50m, "cat1", 10);

        // Act & Assert
        FluentActions.Invoking(() => product.UpdateBasicInfo(invalidName, "Description", 100m))
            .Should().Throw<ArgumentException>()
            .WithMessage("Product name cannot be empty*");
    }

    [Fact]
    public void ClearDomainEvents_ShouldRemoveAllEvents()
    {
        // Arrange
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 5);
        product.UpdateStock(2); // This should add a low stock event

        product.DomainEvents.Should().HaveCount(2); // Creation + LowStock events

        // Act
        product.ClearDomainEvents();

        // Assert
        product.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void IsLowStock_WhenStockBelowThreshold_ShouldReturnTrue()
    {
        // Arrange & Act
        var product = Product.Create("Test Product", "Description", 100m, "cat1", 5);

        // Assert
        product.IsLowStock.Should().BeTrue();
    }

    [Fact]
    public void IsLowStock_WhenStockAboveOrEqualThreshold_ShouldReturnFalse()
    {
        // Arrange & Act
        var productAtThreshold = Product.Create("Test Product 1", "Description", 100m, "cat1", Product.LowStockThreshold);
        var productAboveThreshold = Product.Create("Test Product 2", "Description", 100m, "cat1", Product.LowStockThreshold + 1);

        // Assert
        productAtThreshold.IsLowStock.Should().BeFalse();
        productAboveThreshold.IsLowStock.Should().BeFalse();
    }
}
