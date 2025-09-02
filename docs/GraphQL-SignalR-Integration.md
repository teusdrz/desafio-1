# GraphQL + SignalR Integration Documentation

## Overview

This implementation provides a comprehensive GraphQL API with real-time capabilities through SignalR integration. It follows enterprise-grade patterns with complete CRUD operations, subscriptions, and real-time notifications.

## GraphQL Features

### 1. Schema-First Design
- Type-safe schema with comprehensive DTOs
- Automatic field resolution with HotChocolate
- Built-in filtering, sorting, and pagination support

### 2. Query Operations
Available queries include:
- `getProducts`: Retrieve products with filtering/pagination
- `getProduct(id)`: Get a specific product by ID
- `searchProducts(searchTerm)`: Search products by name/description
- `getProductsByCategory(categoryId)`: Filter products by category
- `getLowStockProducts(threshold)`: Get products below stock threshold
- `getCategories`: Retrieve all categories
- `getCategory(id)`: Get specific category
- `getActiveCategories`: Get only active categories

### 3. Mutation Operations
Available mutations include:
- `createProduct(input)`: Create new product
- `updateProduct(input)`: Update existing product
- `deleteProduct(id)`: Delete product
- `createCategory(input)`: Create new category
- `updateCategory(input)`: Update existing category
- `deleteCategory(id)`: Delete category

### 4. Subscription Operations
Real-time subscriptions include:
- `onProductCreated`: Subscribe to product creation events
- `onProductUpdated`: Subscribe to product update events
- `onProductDeleted`: Subscribe to product deletion events
- `onLowStockAlert`: Subscribe to low stock alerts
- `onStockChanged`: Subscribe to stock level changes
- `onCategoryCreated`: Subscribe to category creation events
- `onCategoryUpdated`: Subscribe to category update events
- `onCategoryDeleted`: Subscribe to category deletion events
- `onNotificationReceived`: Subscribe to general notifications

## SignalR Features

### 1. Real-Time Hubs
- **NotificationHub**: Central hub for all real-time communications
- Room-based messaging with join/leave functionality
- Typing indicators and presence management
- Connection tracking and user management

### 2. Real-Time Events
SignalR automatically broadcasts:
- Product lifecycle events (create/update/delete)
- Category lifecycle events (create/update/delete)
- Stock level changes and low stock alerts
- General system notifications
- User presence and typing indicators

### 3. Hub Methods
Available hub methods:
- `JoinRoom(roomId)`: Join a specific notification room
- `LeaveRoom(roomId)`: Leave a notification room
- `SendMessageToRoom(roomId, message)`: Send message to room
- `SendTypingIndicator(roomId, isTyping)`: Send typing status
- `GetConnectedUsers()`: Get list of connected users

## Integration Architecture

### 1. Event Bridge Service
The `GraphQLEventService` bridges GraphQL subscriptions with SignalR:
- Publishes events to both GraphQL subscribers and SignalR clients
- Maintains consistency between different client types
- Provides unified event publishing interface

### 2. Unified Event Flow
```
Action → Command/Query Handler → GraphQLEventService → [GraphQL Subscription + SignalR Hub]
```

### 3. Authentication Integration
- JWT token authentication for both GraphQL and SignalR
- User identity propagation across both protocols
- Permission-based access control

## Usage Examples

### GraphQL Query Example
```graphql
query GetProducts($first: Int, $where: ProductFilterInput) {
  products(first: $first, where: $where) {
    nodes {
      id
      name
      description
      price
      stockQuantity
      category {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### GraphQL Mutation Example
```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    product {
      id
      name
      description
      price
      stockQuantity
    }
    errorMessage
    success
  }
}
```

### GraphQL Subscription Example
```graphql
subscription OnProductUpdated {
  onProductUpdated {
    id
    name
    description
    price
    stockQuantity
    categoryName
  }
}
```

### SignalR JavaScript Client Example
```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/api/notifications", {
        accessTokenFactory: () => getAuthToken()
    })
    .build();

// Start connection
await connection.start();

// Join a room
await connection.invoke("JoinRoom", "products");

// Listen for product updates
connection.on("ProductUpdated", (product) => {
    console.log("Product updated:", product);
    updateUI(product);
});

// Listen for notifications
connection.on("NotificationReceived", (notification) => {
    console.log("Notification:", notification);
    showNotification(notification);
});
```

## Configuration

### 1. GraphQL Configuration
```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType()
    .AddMutationType()
    .AddSubscriptionType()
    .AddType<ProductType>()
    .AddType<CategoryType>()
    .AddTypeExtension<ProductQueries>()
    .AddTypeExtension<CategoryQueries>()
    .AddTypeExtension<ProductMutations>()
    .AddTypeExtension<CategoryMutations>()
    .AddTypeExtension<ProductSubscriptions>()
    .AddTypeExtension<CategorySubscriptions>()
    .AddTypeExtension<NotificationSubscriptions>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddInMemorySubscriptions()
    .AddAuthorization();
```

### 2. SignalR Configuration
```csharp
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = builder.Environment.IsDevelopment();
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(60);
    options.KeepAliveInterval = TimeSpan.FromSeconds(30);
    options.HandshakeTimeout = TimeSpan.FromSeconds(15);
});
```

## Security Considerations

### 1. Authentication
- Both GraphQL and SignalR require valid JWT tokens
- Token validation occurs on connection establishment
- User identity is available in both contexts

### 2. Authorization
- Permission-based authorization on GraphQL operations
- Hub method authorization based on user roles
- Room-level access control for SignalR

### 3. Rate Limiting
- GraphQL queries are subject to complexity analysis
- SignalR connections have built-in rate limiting
- Per-user connection limits enforced

## Performance Optimizations

### 1. GraphQL Optimizations
- DataLoader pattern for N+1 query prevention
- Query complexity analysis and limits
- Field-level caching with Redis
- Projection optimization for database queries

### 2. SignalR Optimizations
- Connection pooling and management
- Message batching for high-frequency events
- Room-based selective broadcasting
- Connection state management

### 3. Caching Strategy
- Redis caching for frequently accessed data
- GraphQL query result caching
- SignalR message deduplication
- ETag support for conditional requests

## Monitoring and Observability

### 1. Logging
- Structured logging with Serilog
- Request/response logging for GraphQL
- Connection lifecycle logging for SignalR
- Performance metrics collection

### 2. Health Checks
- GraphQL endpoint health monitoring
- SignalR hub connectivity checks
- Database connection monitoring
- Redis cache health verification

### 3. Metrics
- GraphQL query execution times
- SignalR connection counts and duration
- Message delivery success rates
- Error rates and types

## Error Handling

### 1. GraphQL Error Handling
- Standardized error response format
- Field-level error reporting
- Validation error propagation
- Exception filtering and sanitization

### 2. SignalR Error Handling
- Connection failure retry logic
- Message delivery guarantees
- Client disconnection handling
- Hub method exception management

## Testing Strategy

### 1. GraphQL Testing
- Schema validation tests
- Query/mutation integration tests
- Subscription event testing
- Performance and load testing

### 2. SignalR Testing
- Hub method unit tests
- Connection lifecycle tests
- Message delivery verification
- Concurrent connection testing

## Deployment Considerations

### 1. Scaling
- Multiple server instances with Redis backplane
- Load balancer configuration for sticky sessions
- Database connection pooling
- Horizontal scaling support

### 2. Environment Configuration
- Development vs. production settings
- CORS configuration for GraphQL Playground
- SignalR transport fallbacks
- SSL/TLS termination

This implementation provides enterprise-grade GraphQL and SignalR integration with comprehensive real-time capabilities, robust error handling, and production-ready performance optimizations.
