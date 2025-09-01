namespace Hypesoft.Domain.DomainEvents;

/// <summary>
/// Domain event triggered when a product's stock falls below the minimum threshold.
/// This event enables reactive inventory management and automatic notifications.
/// </summary>
public sealed record LowStockDomainEvent(
    string ProductId,
    string ProductName,
    int CurrentStock,
    int MinimumThreshold) : IDomainEvent
{
    /// <inheritdoc/>
    public Guid Id { get; } = Guid.NewGuid();

    /// <inheritdoc/>
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}
