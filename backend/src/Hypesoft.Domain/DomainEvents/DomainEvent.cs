using MediatR;

namespace Hypesoft.Domain.DomainEvents;

public abstract class DomainEvent : INotification
{
    public DateTime OccurredAt { get; protected set; } = DateTime.UtcNow;
    public string EventId { get; protected set; } = Guid.NewGuid().ToString();
}
