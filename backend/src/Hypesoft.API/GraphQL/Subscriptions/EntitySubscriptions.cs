using Hypesoft.Application.DTOs;
using HotChocolate.Subscriptions;
using HotChocolate;

namespace Hypesoft.API.GraphQL.Subscriptions;

[ExtendObjectType("Subscription")]
public class ProductSubscriptions
{
    /// <summary>
    /// Subscribe to product creation events
    /// </summary>
    [Subscribe]
    public ProductDto OnProductCreated([EventMessage] ProductDto product) => product;

    /// <summary>
    /// Subscribe to product update events
    /// </summary>
    [Subscribe]
    public ProductDto OnProductUpdated([EventMessage] ProductDto product) => product;

    /// <summary>
    /// Subscribe to product deletion events
    /// </summary>
    [Subscribe]
    public string OnProductDeleted([EventMessage] string productId) => productId;

    /// <summary>
    /// Subscribe to low stock alerts
    /// </summary>
    [Subscribe]
    public ProductDto OnLowStockAlert([EventMessage] ProductDto product) => product;

    /// <summary>
    /// Subscribe to stock level changes
    /// </summary>
    [Subscribe]
    public ProductDto OnStockChanged([EventMessage] ProductDto product) => product;
}

[ExtendObjectType("Subscription")]
public class CategorySubscriptions
{
    /// <summary>
    /// Subscribe to category creation events
    /// </summary>
    [Subscribe]
    public CategoryDto OnCategoryCreated([EventMessage] CategoryDto category) => category;

    /// <summary>
    /// Subscribe to category update events
    /// </summary>
    [Subscribe]
    public CategoryDto OnCategoryUpdated([EventMessage] CategoryDto category) => category;

    /// <summary>
    /// Subscribe to category deletion events
    /// </summary>
    [Subscribe]
    public string OnCategoryDeleted([EventMessage] string categoryId) => categoryId;
}

[ExtendObjectType("Subscription")]
public class NotificationSubscriptions
{
    /// <summary>
    /// Subscribe to real-time notifications via SignalR
    /// </summary>
    [Subscribe]
    public NotificationDto OnNotificationReceived([EventMessage] NotificationDto notification) => notification;
}
