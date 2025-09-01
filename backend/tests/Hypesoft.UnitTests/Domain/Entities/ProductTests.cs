using Hypesoft.Domain.Entities;
using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.UnitTests.Domain.Entities;

public class ProductTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateProduct()
    {
        // Arrange
        var name = "Test Product";
        var description = "Test Description";
        var price = 100.50m;
        var categoryId = "cat123";
        var stockQuantity = 50;

        // Act
        var product = Product.Create(name, description, price, categoryId, stockQuantity);

        // Assert
        product.Should().NotBeNull();
        product.Name.Should().Be(name);
        product.Description.Should().Be(description);
        product.Price.Value.Should().Be(price);
        product.CategoryId.Should().Be(categoryId);
        product.StockQuantity.Value.Should().Be(stockQuantity);
        product.IsLowStock.Should().BeFalse();
    }

    [Fact]
    public void Create_WithLowStock_ShouldMarkAsLowStock()
    {
        // Arrange
        var name = "Test Product";
        var description = "Test Description";
        var price = 100.50m;
        var categoryId = "cat123";
        var stockQuantity = 5; // Low stock

        // Act
        var product = Product.Create(name, description, price, categoryId, stockQuantity);

        // Assert
        product.IsLowStock.Should().BeTrue();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-10)]
    public void Create_WithInvalidPrice_ShouldThrowException(decimal invalidPrice)
    {
        // Arrange & Act & Assert
        var action = () => Product.Create("Test", "Description", invalidPrice, "cat123", 10);
        action.Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-10)]
    public void Create_WithNegativeStock_ShouldThrowException(int invalidStock)
    {
        // Arrange & Act & Assert
        var action = () => Product.Create("Test", "Description", 100m, "cat123", invalidStock);
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void UpdateBasicInfo_WithValidData_ShouldUpdateProduct()
    {
        // Arrange
        var product = Product.Create("Original", "Original Desc", 50m, "cat123", 20);
        var newName = "Updated Product";
        var newDescription = "Updated Description";
        var newPrice = 75.99m;

        // Act
        product.UpdateBasicInfo(newName, newDescription, newPrice);

        // Assert
        product.Name.Should().Be(newName);
        product.Description.Should().Be(newDescription);
        product.Price.Value.Should().Be(newPrice);
    }

    [Fact]
    public void UpdateStock_WithValidQuantity_ShouldUpdateStock()
    {
        // Arrange
        var product = Product.Create("Test", "Description", 100m, "cat123", 20);
        var newStock = 15;

        // Act
        product.UpdateStock(newStock);

        // Assert
        product.StockQuantity.Value.Should().Be(newStock);
    }

    [Fact]
    public void UpdateStock_ToLowQuantity_ShouldMarkAsLowStock()
    {
        // Arrange
        var product = Product.Create("Test", "Description", 100m, "cat123", 20);
        var lowStock = 5;

        // Act
        product.UpdateStock(lowStock);

        // Assert
        product.StockQuantity.Value.Should().Be(lowStock);
        product.IsLowStock.Should().BeTrue();
    }

    [Fact]
    public void UpdateCategory_WithValidCategoryId_ShouldUpdateCategory()
    {
        // Arrange
        var product = Product.Create("Test", "Description", 100m, "cat123", 20);
        var newCategoryId = "cat456";

        // Act
        product.UpdateCategory(newCategoryId);

        // Assert
        product.CategoryId.Should().Be(newCategoryId);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void UpdateCategory_WithInvalidCategoryId_ShouldThrowException(string invalidCategoryId)
    {
        // Arrange
        var product = Product.Create("Test", "Description", 100m, "cat123", 20);

        // Act & Assert
        var action = () => product.UpdateCategory(invalidCategoryId);
        action.Should().Throw<ArgumentException>();
    }
}
