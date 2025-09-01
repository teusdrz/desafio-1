namespace Hypesoft.Domain.DomainEvents;

public class ProductCreatedEvent : DomainEvent
{
    public string ProductId { get; private set; }
    public string ProductName { get; private set; }
    public decimal Price { get; private set; }
    public string CategoryId { get; private set; }
    public int StockQuantity { get; private set; }

    public ProductCreatedEvent(string productId, string productName, decimal price, string categoryId, int stockQuantity)
    {
        ProductId = productId;
        ProductName = productName;
        Price = price;
        CategoryId = categoryId;
        StockQuantity = stockQuantity;
    }
}

public class ProductUpdatedEvent : DomainEvent
{
    public string ProductId { get; private set; }
    public string ProductName { get; private set; }
    public decimal Price { get; private set; }
    public string CategoryId { get; private set; }

    public ProductUpdatedEvent(string productId, string productName, decimal price, string categoryId)
    {
        ProductId = productId;
        ProductName = productName;
        Price = price;
        CategoryId = categoryId;
    }
}

public class ProductStockUpdatedEvent : DomainEvent
{
    public string ProductId { get; private set; }
    public int PreviousStock { get; private set; }
    public int NewStock { get; private set; }
    public bool IsLowStock { get; private set; }

    public ProductStockUpdatedEvent(string productId, int previousStock, int newStock, bool isLowStock)
    {
        ProductId = productId;
        PreviousStock = previousStock;
        NewStock = newStock;
        IsLowStock = isLowStock;
    }
}

public class ProductDeletedEvent : DomainEvent
{
    public string ProductId { get; private set; }
    public string ProductName { get; private set; }

    public ProductDeletedEvent(string productId, string productName)
    {
        ProductId = productId;
        ProductName = productName;
    }
}

public class LowStockDetectedEvent : DomainEvent
{
    public string ProductId { get; private set; }
    public string ProductName { get; private set; }
    public int CurrentStock { get; private set; }
    public int LowStockThreshold { get; private set; }

    public LowStockDetectedEvent(string productId, string productName, int currentStock, int lowStockThreshold = 10)
    {
        ProductId = productId;
        ProductName = productName;
        CurrentStock = currentStock;
        LowStockThreshold = lowStockThreshold;
    }
}
