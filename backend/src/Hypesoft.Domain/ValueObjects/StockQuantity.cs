namespace Hypesoft.Domain.ValueObjects;

public class StockQuantity
{
    public int Value { get; private set; }

    private StockQuantity(int value)
    {
        Value = value;
    }

    public static StockQuantity Create(int value)
    {
        if (value < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(value));

        return new StockQuantity(value);
    }

    public static implicit operator int(StockQuantity quantity) => quantity.Value;

    public override bool Equals(object? obj)
    {
        return obj is StockQuantity other && Value == other.Value;
    }

    public override int GetHashCode() => Value.GetHashCode();

    public override string ToString() => Value.ToString();
}
