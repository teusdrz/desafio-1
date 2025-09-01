using Hypesoft.Domain.DomainEvents;

namespace Hypesoft.Domain.Common;

/// <summary>
/// Base class for all aggregate roots in the domain.
/// Provides functionality for managing domain events and ensuring consistency.
/// </summary>
public abstract class AggregateRoot
{
    private readonly List<IDomainEvent> _domainEvents = new();

    /// <summary>
    /// Gets the unique identifier of the aggregate root.
    /// </summary>
    public abstract string Id { get; protected set; }

    /// <summary>
    /// Gets the timestamp when the aggregate was created.
    /// </summary>
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets the timestamp when the aggregate was last updated.
    /// </summary>
    public DateTime UpdatedAt { get; protected set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets the version of the aggregate for optimistic concurrency control.
    /// </summary>
    public long Version { get; protected set; } = 1;

    /// <summary>
    /// Gets all domain events that have been raised by this aggregate.
    /// </summary>
    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    /// <summary>
    /// Adds a domain event to the aggregate's collection of events.
    /// </summary>
    /// <param name="domainEvent">The domain event to add.</param>
    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    /// <summary>
    /// Clears all domain events from the aggregate.
    /// This method should be called after events have been published.
    /// </summary>
    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    /// <summary>
    /// Marks the aggregate as updated, incrementing the version and updating the timestamp.
    /// </summary>
    protected void MarkAsUpdated()
    {
        UpdatedAt = DateTime.UtcNow;
        Version++;
    }
}
