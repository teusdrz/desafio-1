using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.UnitTests.Domain.ValueObjects;

public class StockQuantityTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(10)]
    [InlineData(1000)]
    public void Create_WithValidQuantity_ShouldCreateStockQuantity(int validQuantity)
    {
        // Act
        var stockQuantity = StockQuantity.Create(validQuantity);

        // Assert
        stockQuantity.Should().NotBeNull();
        stockQuantity.Value.Should().Be(validQuantity);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-10)]
    [InlineData(-1000)]
    public void Create_WithNegativeQuantity_ShouldThrowException(int negativeQuantity)
    {
        // Act & Assert
        var action = () => StockQuantity.Create(negativeQuantity);
        action.Should().Throw<ArgumentException>()
            .WithMessage("Stock quantity cannot be negative");
    }

    [Theory]
    [InlineData(0, true)]
    [InlineData(1, true)]
    [InlineData(5, true)]
    [InlineData(9, true)]
    [InlineData(10, false)]
    [InlineData(15, false)]
    [InlineData(100, false)]
    public void IsLow_ShouldReturnCorrectValue(int quantity, bool expectedIsLow)
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(quantity);

        // Act
        var isLow = stockQuantity.IsLow;

        // Assert
        isLow.Should().Be(expectedIsLow);
    }

    [Theory]
    [InlineData(0, true)]
    [InlineData(1, false)]
    [InlineData(10, false)]
    public void IsEmpty_ShouldReturnCorrectValue(int quantity, bool expectedIsEmpty)
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(quantity);

        // Act
        var isEmpty = stockQuantity.IsEmpty;

        // Assert
        isEmpty.Should().Be(expectedIsEmpty);
    }

    [Fact]
    public void Equals_WithSameValue_ShouldReturnTrue()
    {
        // Arrange
        var stock1 = StockQuantity.Create(50);
        var stock2 = StockQuantity.Create(50);

        // Act & Assert
        stock1.Should().Be(stock2);
        (stock1 == stock2).Should().BeTrue();
        (stock1 != stock2).Should().BeFalse();
    }

    [Fact]
    public void Equals_WithDifferentValue_ShouldReturnFalse()
    {
        // Arrange
        var stock1 = StockQuantity.Create(50);
        var stock2 = StockQuantity.Create(25);

        // Act & Assert
        stock1.Should().NotBe(stock2);
        (stock1 == stock2).Should().BeFalse();
        (stock1 != stock2).Should().BeTrue();
    }

    [Fact]
    public void GetHashCode_WithSameValue_ShouldReturnSameHashCode()
    {
        // Arrange
        var stock1 = StockQuantity.Create(50);
        var stock2 = StockQuantity.Create(50);

        // Act & Assert
        stock1.GetHashCode().Should().Be(stock2.GetHashCode());
    }

    [Fact]
    public void ToString_ShouldReturnFormattedValue()
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(50);

        // Act
        var result = stockQuantity.ToString();

        // Assert
        result.Should().Be("50 units");
    }

    [Fact]
    public void Add_WithValidAmount_ShouldReturnIncreasedStock()
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(50);
        var addAmount = 25;

        // Act
        var result = stockQuantity.Add(addAmount);

        // Assert
        result.Value.Should().Be(75);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-10)]
    public void Add_WithNegativeAmount_ShouldThrowException(int negativeAmount)
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(50);

        // Act & Assert
        var action = () => stockQuantity.Add(negativeAmount);
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Subtract_WithValidAmount_ShouldReturnDecreasedStock()
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(50);
        var subtractAmount = 25;

        // Act
        var result = stockQuantity.Subtract(subtractAmount);

        // Assert
        result.Value.Should().Be(25);
    }

    [Fact]
    public void Subtract_WithAmountEqualToStock_ShouldReturnZero()
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(50);
        var subtractAmount = 50;

        // Act
        var result = stockQuantity.Subtract(subtractAmount);

        // Assert
        result.Value.Should().Be(0);
    }

    [Fact]
    public void Subtract_WithAmountGreaterThanStock_ShouldThrowException()
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(25);
        var subtractAmount = 50;

        // Act & Assert
        var action = () => stockQuantity.Subtract(subtractAmount);
        action.Should().Throw<ArgumentException>()
            .WithMessage("Cannot subtract more than available stock");
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-10)]
    public void Subtract_WithNegativeAmount_ShouldThrowException(int negativeAmount)
    {
        // Arrange
        var stockQuantity = StockQuantity.Create(50);

        // Act & Assert
        var action = () => stockQuantity.Subtract(negativeAmount);
        action.Should().Throw<ArgumentException>();
    }
}
