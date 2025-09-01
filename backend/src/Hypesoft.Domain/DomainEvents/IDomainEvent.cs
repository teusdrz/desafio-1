using MediatR;

namespace Hypesoft.Domain.DomainEvents;

/// <summary>
/// Base interface for all domain events in the system.
/// Domain events represent something meaningful that happened in the domain.
/// </summary>
public interface IDomainEvent : INotification
{
    /// <summary>
    /// Gets the unique identifier of the domain event.
    /// </summary>
    Guid Id { get; }

    /// <summary>
    /// Gets the timestamp when the domain event occurred.
    /// </summary>
    DateTime OccurredOn { get; }
}
