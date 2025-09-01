using MediatR;
using Microsoft.Extensions.Logging;
using Hypesoft.Domain.DomainEvents;

namespace Hypesoft.Application.DomainEventHandlers;

public class CategoryAuditEventHandler :
    INotificationHandler<CategoryCreatedEvent>,
    INotificationHandler<CategoryUpdatedEvent>,
    INotificationHandler<CategoryActivatedEvent>,
    INotificationHandler<CategoryDeactivatedEvent>
{
    private readonly ILogger<CategoryAuditEventHandler> _logger;

    public CategoryAuditEventHandler(ILogger<CategoryAuditEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(CategoryCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("AUDIT - Category Created: {CategoryId} '{CategoryName}' - Description: {Description}",
            notification.CategoryId,
            notification.CategoryName,
            notification.Description);

        return Task.CompletedTask;
    }

    public Task Handle(CategoryUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("AUDIT - Category Updated: {CategoryId} '{CategoryName}' - Description: {Description}",
            notification.CategoryId,
            notification.CategoryName,
            notification.Description);

        return Task.CompletedTask;
    }

    public Task Handle(CategoryActivatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("AUDIT - Category Activated: {CategoryId} '{CategoryName}'",
            notification.CategoryId,
            notification.CategoryName);

        return Task.CompletedTask;
    }

    public Task Handle(CategoryDeactivatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogWarning("AUDIT - Category Deactivated: {CategoryId} '{CategoryName}' - Products affected: {ProductCount}",
            notification.CategoryId,
            notification.CategoryName,
            notification.ProductCount);

        return Task.CompletedTask;
    }
}
