using HotChocolate.Subscriptions;
using Hypesoft.API.GraphQL.Subscriptions;
using Hypesoft.Domain.Entities;

namespace Hypesoft.API.GraphQL.Services;

public interface IGraphQLSubscriptionService
{
    Task NotifyProductCreated(Product product);
    Task NotifyProductUpdated(Product product);
    Task NotifyProductDeleted(Guid productId, string productName);
    Task NotifyStockChanged(Product product);
    Task NotifyCategoryCreated(Category category);
    Task NotifyCategoryUpdated(Category category);
    Task NotifyCategoryDeleted(Guid categoryId, string categoryName);
}

public class GraphQLSubscriptionService : IGraphQLSubscriptionService
{
    private readonly ITopicEventSender _eventSender;

    public GraphQLSubscriptionService(ITopicEventSender eventSender)
    {
        _eventSender = eventSender;
    }

    public async Task NotifyProductCreated(Product product)
    {
        await _eventSender.SendAsync(nameof(ProductSubscriptions.OnProductCreated), product);
    }

    public async Task NotifyProductUpdated(Product product)
    {
        await _eventSender.SendAsync(nameof(ProductSubscriptions.OnProductUpdated), product);
    }

    public async Task NotifyProductDeleted(Guid productId, string productName)
    {
        var deletionEvent = new ProductDeletionEvent
        {
            ProductId = productId,
            ProductName = productName,
            DeletedAt = DateTime.UtcNow
        };

        await _eventSender.SendAsync(nameof(ProductSubscriptions.OnProductDeleted), deletionEvent);
    }

    public async Task NotifyStockChanged(Product product)
    {
        await _eventSender.SendAsync(nameof(ProductSubscriptions.OnStockChanged), product);
    }

    public async Task NotifyCategoryCreated(Category category)
    {
        await _eventSender.SendAsync(nameof(CategorySubscriptions.OnCategoryCreated), category);
    }

    public async Task NotifyCategoryUpdated(Category category)
    {
        await _eventSender.SendAsync(nameof(CategorySubscriptions.OnCategoryUpdated), category);
    }

    public async Task NotifyCategoryDeleted(Guid categoryId, string categoryName)
    {
        var deletionEvent = new CategoryDeletionEvent
        {
            CategoryId = categoryId,
            CategoryName = categoryName,
            DeletedAt = DateTime.UtcNow
        };

        await _eventSender.SendAsync(nameof(CategorySubscriptions.OnCategoryDeleted), deletionEvent);
    }
}
