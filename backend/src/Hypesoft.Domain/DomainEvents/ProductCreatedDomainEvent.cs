namespace Hypesoft.Domain.DomainEvents;

/// <summary>
/// Domain event triggered when a new product is created in the system.
/// This event can be used to trigger side effects like cache invalidation,
/// analytics tracking, or notifications.
/// </summary>
public sealed record ProductCreatedDomainEvent(
    string ProductId,
    string ProductName,
    decimal Price,
    string CategoryId,
    int StockQuantity) : IDomainEvent
{
    /// <inheritdoc/>
    public Guid Id { get; } = Guid.NewGuid();

    /// <inheritdoc/>
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}
