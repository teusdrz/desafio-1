namespace Hypesoft.Domain.DomainEvents;

public class CategoryCreatedEvent : DomainEvent
{
    public string CategoryId { get; private set; }
    public string CategoryName { get; private set; }
    public string Description { get; private set; }

    public CategoryCreatedEvent(string categoryId, string categoryName, string description)
    {
        CategoryId = categoryId;
        CategoryName = categoryName;
        Description = description;
    }
}

public class CategoryUpdatedEvent : DomainEvent
{
    public string CategoryId { get; private set; }
    public string CategoryName { get; private set; }
    public string Description { get; private set; }

    public CategoryUpdatedEvent(string categoryId, string categoryName, string description)
    {
        CategoryId = categoryId;
        CategoryName = categoryName;
        Description = description;
    }
}

public class CategoryDeactivatedEvent : DomainEvent
{
    public string CategoryId { get; private set; }
    public string CategoryName { get; private set; }
    public int ProductCount { get; private set; }

    public CategoryDeactivatedEvent(string categoryId, string categoryName, int productCount)
    {
        CategoryId = categoryId;
        CategoryName = categoryName;
        ProductCount = productCount;
    }
}

public class CategoryActivatedEvent : DomainEvent
{
    public string CategoryId { get; private set; }
    public string CategoryName { get; private set; }

    public CategoryActivatedEvent(string categoryId, string categoryName)
    {
        CategoryId = categoryId;
        CategoryName = categoryName;
    }
}
