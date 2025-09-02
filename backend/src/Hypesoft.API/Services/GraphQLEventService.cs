using Hypesoft.Application.DTOs;
using Hypesoft.API.Hubs;
using Hypesoft.API.GraphQL.Subscriptions;
using Microsoft.AspNetCore.SignalR;
using HotChocolate.Subscriptions;

namespace Hypesoft.API.Services;

/// <summary>
/// Service that bridges GraphQL subscriptions with SignalR real-time notifications
/// Provides unified event publishing for both GraphQL clients and SignalR clients
/// </summary>
public interface IGraphQLEventService
{
    Task PublishProductCreatedAsync(ProductDto product);
    Task PublishProductUpdatedAsync(ProductDto product);
    Task PublishProductDeletedAsync(string productId);
    Task PublishCategoryCreatedAsync(CategoryDto category);
    Task PublishCategoryUpdatedAsync(CategoryDto category);
    Task PublishCategoryDeletedAsync(string categoryId);
    Task PublishLowStockAlertAsync(ProductDto product);
    Task PublishNotificationAsync(NotificationDto notification);
}

public class GraphQLEventService : IGraphQLEventService
{
    private readonly ITopicEventSender _eventSender;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<GraphQLEventService> _logger;

    public GraphQLEventService(
        ITopicEventSender eventSender,
        IHubContext<NotificationHub> hubContext,
        ILogger<GraphQLEventService> logger)
    {
        _eventSender = eventSender;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task PublishProductCreatedAsync(ProductDto product)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(ProductSubscriptions.OnProductCreated), product);

            // SignalR notification
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Type = "PRODUCT_CREATED",
                Title = "New Product Created",
                Message = $"Product '{product.Name}' has been created",
                Timestamp = DateTime.UtcNow,
                Data = product
            };

            await _hubContext.Clients.All.SendAsync("ProductCreated", product);
            await PublishNotificationAsync(notification);

            _logger.LogInformation("Published product created event for product {ProductId}", product.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing product created event for product {ProductId}", product.Id);
        }
    }

    public async Task PublishProductUpdatedAsync(ProductDto product)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(ProductSubscriptions.OnProductUpdated), product);

            // SignalR notification
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Type = "PRODUCT_UPDATED",
                Title = "Product Updated",
                Message = $"Product '{product.Name}' has been updated",
                Timestamp = DateTime.UtcNow,
                Data = product
            };

            await _hubContext.Clients.All.SendAsync("ProductUpdated", product);
            await PublishNotificationAsync(notification);

            _logger.LogInformation("Published product updated event for product {ProductId}", product.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing product updated event for product {ProductId}", product.Id);
        }
    }

    public async Task PublishProductDeletedAsync(string productId)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(ProductSubscriptions.OnProductDeleted), productId);

            // SignalR notification
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Type = "PRODUCT_DELETED",
                Title = "Product Deleted",
                Message = $"Product with ID '{productId}' has been deleted",
                Timestamp = DateTime.UtcNow,
                Data = new { ProductId = productId }
            };

            await _hubContext.Clients.All.SendAsync("ProductDeleted", productId);
            await PublishNotificationAsync(notification);

            _logger.LogInformation("Published product deleted event for product {ProductId}", productId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing product deleted event for product {ProductId}", productId);
        }
    }

    public async Task PublishCategoryCreatedAsync(CategoryDto category)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(CategorySubscriptions.OnCategoryCreated), category);

            // SignalR notification
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Type = "CATEGORY_CREATED",
                Title = "New Category Created",
                Message = $"Category '{category.Name}' has been created",
                Timestamp = DateTime.UtcNow,
                Data = category
            };

            await _hubContext.Clients.All.SendAsync("CategoryCreated", category);
            await PublishNotificationAsync(notification);

            _logger.LogInformation("Published category created event for category {CategoryId}", category.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing category created event for category {CategoryId}", category.Id);
        }
    }

    public async Task PublishCategoryUpdatedAsync(CategoryDto category)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(CategorySubscriptions.OnCategoryUpdated), category);

            // SignalR notification
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Type = "CATEGORY_UPDATED",
                Title = "Category Updated",
                Message = $"Category '{category.Name}' has been updated",
                Timestamp = DateTime.UtcNow,
                Data = category
            };

            await _hubContext.Clients.All.SendAsync("CategoryUpdated", category);
            await PublishNotificationAsync(notification);

            _logger.LogInformation("Published category updated event for category {CategoryId}", category.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing category updated event for category {CategoryId}", category.Id);
        }
    }

    public async Task PublishCategoryDeletedAsync(string categoryId)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(CategorySubscriptions.OnCategoryDeleted), categoryId);

            // SignalR notification
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Type = "CATEGORY_DELETED",
                Title = "Category Deleted",
                Message = $"Category with ID '{categoryId}' has been deleted",
                Timestamp = DateTime.UtcNow,
                Data = new { CategoryId = categoryId }
            };

            await _hubContext.Clients.All.SendAsync("CategoryDeleted", categoryId);
            await PublishNotificationAsync(notification);

            _logger.LogInformation("Published category deleted event for category {CategoryId}", categoryId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing category deleted event for category {CategoryId}", categoryId);
        }
    }

    public async Task PublishLowStockAlertAsync(ProductDto product)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(ProductSubscriptions.OnLowStockAlert), product);

            // SignalR notification
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Type = "LOW_STOCK_ALERT",
                Title = "Low Stock Alert",
                Message = $"Product '{product.Name}' is low on stock ({product.StockQuantity} remaining)",
                Timestamp = DateTime.UtcNow,
                Data = product
            };

            await _hubContext.Clients.All.SendAsync("LowStockAlert", product);
            await PublishNotificationAsync(notification);

            _logger.LogWarning("Published low stock alert for product {ProductId} - Stock: {Stock}",
                product.Id, product.StockQuantity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing low stock alert for product {ProductId}", product.Id);
        }
    }

    public async Task PublishNotificationAsync(NotificationDto notification)
    {
        try
        {
            // GraphQL subscription
            await _eventSender.SendAsync(nameof(NotificationSubscriptions.OnNotificationReceived), notification);

            // SignalR notification to specific notification channel
            await _hubContext.Clients.All.SendAsync("NotificationReceived", notification);

            _logger.LogInformation("Published notification {NotificationId} of type {Type}",
                notification.Id, notification.Type);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing notification {NotificationId}", notification.Id);
        }
    }
}
