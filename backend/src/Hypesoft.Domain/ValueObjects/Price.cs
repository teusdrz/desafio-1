namespace Hypesoft.Domain.ValueObjects;

public class Price
{
    public decimal Value { get; private set; }

    private Price(decimal value)
    {
        Value = value;
    }

    public static Price Create(decimal value)
    {
        if (value < 0)
            throw new ArgumentException("Price cannot be negative", nameof(value));

        return new Price(value);
    }

    public static implicit operator decimal(Price price) => price.Value;

    public override bool Equals(object? obj)
    {
        return obj is Price other && Value == other.Value;
    }

    public override int GetHashCode() => Value.GetHashCode();

    public override string ToString() => Value.ToString("C");
}
