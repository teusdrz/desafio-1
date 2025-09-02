using Microsoft.AspNetCore.SignalR;
using Hypesoft.API.Hubs;

namespace Hypesoft.API.Services;

public interface ISignalRNotificationService
{
    Task SendNotificationToUser(string userId, string title, string message, object? data = null);
    Task SendNotificationToAll(string title, string message, object? data = null);
    Task SendNotificationToGroup(string groupName, string title, string message, object? data = null);

    // Product-specific notifications
    Task NotifyProductCreated(object product);
    Task NotifyProductUpdated(object product);
    Task NotifyProductDeleted(Guid productId, string productName);
    Task NotifyStockChanged(object product, int oldStock, int newStock);

    // Category-specific notifications
    Task NotifyCategoryCreated(object category);
    Task NotifyCategoryUpdated(object category);
    Task NotifyCategoryDeleted(Guid categoryId, string categoryName);

    // System notifications
    Task NotifySystemMaintenance(DateTime scheduledTime, string message);
    Task NotifySystemAlert(string alertType, string message);
}

public class SignalRNotificationService : ISignalRNotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<SignalRNotificationService> _logger;

    public SignalRNotificationService(
        IHubContext<NotificationHub> hubContext,
        ILogger<SignalRNotificationService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task SendNotificationToUser(string userId, string title, string message, object? data = null)
    {
        try
        {
            await _hubContext.Clients.Group($"user_{userId}").SendAsync("ReceiveNotification", new
            {
                Title = title,
                Message = message,
                Data = data,
                Timestamp = DateTime.UtcNow,
                Type = "personal"
            });

            _logger.LogInformation("Notification sent to user {UserId}: {Title}", userId, title);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending notification to user {UserId}", userId);
        }
    }

    public async Task SendNotificationToAll(string title, string message, object? data = null)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("ReceiveNotification", new
            {
                Title = title,
                Message = message,
                Data = data,
                Timestamp = DateTime.UtcNow,
                Type = "broadcast"
            });

            _logger.LogInformation("Broadcast notification sent: {Title}", title);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending broadcast notification");
        }
    }

    public async Task SendNotificationToGroup(string groupName, string title, string message, object? data = null)
    {
        try
        {
            await _hubContext.Clients.Group(groupName).SendAsync("ReceiveNotification", new
            {
                Title = title,
                Message = message,
                Data = data,
                Timestamp = DateTime.UtcNow,
                Type = "group",
                Group = groupName
            });

            _logger.LogInformation("Group notification sent to {GroupName}: {Title}", groupName, title);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending notification to group {GroupName}", groupName);
        }
    }

    public async Task NotifyProductCreated(object product)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("ProductCreated", new
            {
                Product = product,
                Timestamp = DateTime.UtcNow,
                EventType = "product_created"
            });

            _logger.LogInformation("Product created notification sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending product created notification");
        }
    }

    public async Task NotifyProductUpdated(object product)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("ProductUpdated", new
            {
                Product = product,
                Timestamp = DateTime.UtcNow,
                EventType = "product_updated"
            });

            _logger.LogInformation("Product updated notification sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending product updated notification");
        }
    }

    public async Task NotifyProductDeleted(Guid productId, string productName)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("ProductDeleted", new
            {
                ProductId = productId,
                ProductName = productName,
                Timestamp = DateTime.UtcNow,
                EventType = "product_deleted"
            });

            _logger.LogInformation("Product deleted notification sent for {ProductName}", productName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending product deleted notification");
        }
    }

    public async Task NotifyStockChanged(object product, int oldStock, int newStock)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("StockChanged", new
            {
                Product = product,
                OldStock = oldStock,
                NewStock = newStock,
                Timestamp = DateTime.UtcNow,
                EventType = "stock_changed"
            });

            _logger.LogInformation("Stock changed notification sent: {OldStock} -> {NewStock}", oldStock, newStock);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending stock changed notification");
        }
    }

    public async Task NotifyCategoryCreated(object category)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("CategoryCreated", new
            {
                Category = category,
                Timestamp = DateTime.UtcNow,
                EventType = "category_created"
            });

            _logger.LogInformation("Category created notification sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending category created notification");
        }
    }

    public async Task NotifyCategoryUpdated(object category)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("CategoryUpdated", new
            {
                Category = category,
                Timestamp = DateTime.UtcNow,
                EventType = "category_updated"
            });

            _logger.LogInformation("Category updated notification sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending category updated notification");
        }
    }

    public async Task NotifyCategoryDeleted(Guid categoryId, string categoryName)
    {
        try
        {
            await _hubContext.Clients.Group("general_notifications").SendAsync("CategoryDeleted", new
            {
                CategoryId = categoryId,
                CategoryName = categoryName,
                Timestamp = DateTime.UtcNow,
                EventType = "category_deleted"
            });

            _logger.LogInformation("Category deleted notification sent for {CategoryName}", categoryName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending category deleted notification");
        }
    }

    public async Task NotifySystemMaintenance(DateTime scheduledTime, string message)
    {
        try
        {
            await SendNotificationToAll(
                "System Maintenance Scheduled",
                message,
                new { ScheduledTime = scheduledTime, Type = "maintenance" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending system maintenance notification");
        }
    }

    public async Task NotifySystemAlert(string alertType, string message)
    {
        try
        {
            await SendNotificationToAll(
                $"System Alert: {alertType}",
                message,
                new { AlertType = alertType, Severity = "high" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending system alert notification");
        }
    }
}
