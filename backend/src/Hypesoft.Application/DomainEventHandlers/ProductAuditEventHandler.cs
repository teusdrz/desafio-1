using MediatR;
using Microsoft.Extensions.Logging;
using Hypesoft.Domain.DomainEvents;

namespace Hypesoft.Application.DomainEventHandlers;

public class ProductAuditEventHandler :
    INotificationHandler<ProductCreatedEvent>,
    INotificationHandler<ProductUpdatedEvent>,
    INotificationHandler<ProductStockUpdatedEvent>,
    INotificationHandler<ProductDeletedEvent>,
    INotificationHandler<LowStockDetectedEvent>
{
    private readonly ILogger<ProductAuditEventHandler> _logger;

    public ProductAuditEventHandler(ILogger<ProductAuditEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(ProductCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("AUDIT - Product Created: {ProductId} '{ProductName}' - Price: {Price}, Category: {CategoryId}, Stock: {Stock}",
            notification.ProductId,
            notification.ProductName,
            notification.Price,
            notification.CategoryId,
            notification.StockQuantity);

        return Task.CompletedTask;
    }

    public Task Handle(ProductUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("AUDIT - Product Updated: {ProductId} '{ProductName}' - New Price: {Price}, New Category: {CategoryId}",
            notification.ProductId,
            notification.ProductName,
            notification.Price,
            notification.CategoryId);

        return Task.CompletedTask;
    }

    public Task Handle(ProductStockUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("AUDIT - Product Stock Updated: {ProductId} - Stock changed from {PreviousStock} to {NewStock}, LowStock: {IsLowStock}",
            notification.ProductId,
            notification.PreviousStock,
            notification.NewStock,
            notification.IsLowStock);

        return Task.CompletedTask;
    }

    public Task Handle(ProductDeletedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogWarning("AUDIT - Product Deleted: {ProductId} '{ProductName}'",
            notification.ProductId,
            notification.ProductName);

        return Task.CompletedTask;
    }

    public Task Handle(LowStockDetectedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogWarning("AUDIT - Low Stock Alert: Product {ProductId} '{ProductName}' has only {CurrentStock} units (Threshold: {Threshold})",
            notification.ProductId,
            notification.ProductName,
            notification.CurrentStock,
            notification.LowStockThreshold);

        return Task.CompletedTask;
    }
}
