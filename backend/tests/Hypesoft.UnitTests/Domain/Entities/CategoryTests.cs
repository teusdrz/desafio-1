using Hypesoft.Domain.Entities;

namespace Hypesoft.UnitTests.Domain.Entities;

public class CategoryTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateCategory()
    {
        // Arrange
        var name = "Electronics";
        var description = "Electronic products";

        // Act
        var category = Category.Create(name, description);

        // Assert
        category.Should().NotBeNull();
        category.Name.Should().Be(name);
        category.Description.Should().Be(description);
        category.IsActive.Should().BeTrue();
        category.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Create_WithInvalidName_ShouldThrowException(string invalidName)
    {
        // Arrange & Act & Assert
        var action = () => Category.Create(invalidName, "Valid description");
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Update_WithValidData_ShouldUpdateCategory()
    {
        // Arrange
        var category = Category.Create("Original", "Original Description");
        var newName = "Updated Electronics";
        var newDescription = "Updated electronic products";

        // Act
        category.Update(newName, newDescription);

        // Assert
        category.Name.Should().Be(newName);
        category.Description.Should().Be(newDescription);
        category.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Activate_WhenInactive_ShouldActivateCategory()
    {
        // Arrange
        var category = Category.Create("Test", "Description");
        category.Deactivate();

        // Act
        category.Activate();

        // Assert
        category.IsActive.Should().BeTrue();
        category.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Deactivate_WhenActive_ShouldDeactivateCategory()
    {
        // Arrange
        var category = Category.Create("Test", "Description");

        // Act
        category.Deactivate();

        // Assert
        category.IsActive.Should().BeFalse();
        category.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void AddProduct_WithValidProduct_ShouldAddToCollection()
    {
        // Arrange
        var category = Category.Create("Electronics", "Electronic products");
        var product = Product.Create("Laptop", "Gaming laptop", 1500m, category.Id, 10);

        // Act
        category.AddProduct(product);

        // Assert
        category.Products.Should().Contain(product);
        category.Products.Should().HaveCount(1);
    }

    [Fact]
    public void AddProduct_WithNullProduct_ShouldThrowException()
    {
        // Arrange
        var category = Category.Create("Electronics", "Electronic products");

        // Act & Assert
        var action = () => category.AddProduct(null!);
        action.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void RemoveProduct_WithExistingProduct_ShouldRemoveFromCollection()
    {
        // Arrange
        var category = Category.Create("Electronics", "Electronic products");
        var product = Product.Create("Laptop", "Gaming laptop", 1500m, category.Id, 10);
        category.AddProduct(product);

        // Act
        category.RemoveProduct(product);

        // Assert
        category.Products.Should().NotContain(product);
        category.Products.Should().BeEmpty();
    }
}
