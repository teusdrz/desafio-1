using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.UnitTests.Domain.ValueObjects;

public class PriceTests
{
    [Theory]
    [InlineData(0.01)]
    [InlineData(1.00)]
    [InlineData(999.99)]
    [InlineData(1000000.00)]
    public void Create_WithValidAmount_ShouldCreatePrice(decimal validAmount)
    {
        // Act
        var price = Price.Create(validAmount);

        // Assert
        price.Should().NotBeNull();
        price.Value.Should().Be(validAmount);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-0.01)]
    [InlineData(-1.00)]
    [InlineData(-999.99)]
    public void Create_WithInvalidAmount_ShouldThrowException(decimal invalidAmount)
    {
        // Act & Assert
        var action = () => Price.Create(invalidAmount);
        action.Should().Throw<ArgumentException>()
            .WithMessage("Price must be greater than zero");
    }

    [Fact]
    public void Equals_WithSameValue_ShouldReturnTrue()
    {
        // Arrange
        var price1 = Price.Create(100.50m);
        var price2 = Price.Create(100.50m);

        // Act & Assert
        price1.Should().Be(price2);
        (price1 == price2).Should().BeTrue();
        (price1 != price2).Should().BeFalse();
    }

    [Fact]
    public void Equals_WithDifferentValue_ShouldReturnFalse()
    {
        // Arrange
        var price1 = Price.Create(100.50m);
        var price2 = Price.Create(200.75m);

        // Act & Assert
        price1.Should().NotBe(price2);
        (price1 == price2).Should().BeFalse();
        (price1 != price2).Should().BeTrue();
    }

    [Fact]
    public void GetHashCode_WithSameValue_ShouldReturnSameHashCode()
    {
        // Arrange
        var price1 = Price.Create(100.50m);
        var price2 = Price.Create(100.50m);

        // Act & Assert
        price1.GetHashCode().Should().Be(price2.GetHashCode());
    }

    [Fact]
    public void ToString_ShouldReturnFormattedValue()
    {
        // Arrange
        var price = Price.Create(100.50m);

        // Act
        var result = price.ToString();

        // Assert
        result.Should().Be("$100.50");
    }

    [Fact]
    public void Add_WithAnotherPrice_ShouldReturnSummedPrice()
    {
        // Arrange
        var price1 = Price.Create(100.50m);
        var price2 = Price.Create(50.25m);

        // Act
        var result = price1.Add(price2);

        // Assert
        result.Value.Should().Be(150.75m);
    }

    [Fact]
    public void Subtract_WithAnotherPrice_ShouldReturnSubtractedPrice()
    {
        // Arrange
        var price1 = Price.Create(100.50m);
        var price2 = Price.Create(50.25m);

        // Act
        var result = price1.Subtract(price2);

        // Assert
        result.Value.Should().Be(50.25m);
    }

    [Fact]
    public void Subtract_ResultingInNegative_ShouldThrowException()
    {
        // Arrange
        var price1 = Price.Create(50.25m);
        var price2 = Price.Create(100.50m);

        // Act & Assert
        var action = () => price1.Subtract(price2);
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Multiply_WithPositiveNumber_ShouldReturnMultipliedPrice()
    {
        // Arrange
        var price = Price.Create(100.50m);
        var multiplier = 2;

        // Act
        var result = price.Multiply(multiplier);

        // Assert
        result.Value.Should().Be(201.00m);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-2)]
    public void Multiply_WithInvalidMultiplier_ShouldThrowException(int invalidMultiplier)
    {
        // Arrange
        var price = Price.Create(100.50m);

        // Act & Assert
        var action = () => price.Multiply(invalidMultiplier);
        action.Should().Throw<ArgumentException>();
    }
}
