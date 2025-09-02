using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using MediatR;
using HotChocolate;

namespace Hypesoft.API.GraphQL.Queries;

[ExtendObjectType("Query")]
public class ProductQueries
{
    /// <summary>
    /// Gets all products with optional filtering and pagination
    /// </summary>
    [UseFiltering]
    [UsePaging]
    [UseSorting]
    public async Task<IQueryable<ProductDto>> GetProducts(
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetAllProductsQuery(), cancellationToken);
        return result.AsQueryable();
    }

    /// <summary>
    /// Gets a specific product by ID
    /// </summary>
    public async Task<ProductDto?> GetProduct(
        string id,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductByIdQuery { Id = id }, cancellationToken);
        return result;
    }

    /// <summary>
    /// Search products by name or description
    /// </summary>
    [UseFiltering]
    [UsePaging]
    [UseSorting]
    public async Task<IQueryable<ProductDto>> SearchProducts(
        string searchTerm,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new SearchProductsByNameQuery { Name = searchTerm }, cancellationToken);
        return result.AsQueryable();
    }

    /// <summary>
    /// Gets products by category
    /// </summary>
    [UseFiltering]
    [UsePaging]
    [UseSorting]
    public async Task<IQueryable<ProductDto>> GetProductsByCategory(
        string categoryId,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductsByCategoryQuery { CategoryId = categoryId }, cancellationToken);
        return result.AsQueryable();
    }

    /// <summary>
    /// Gets products with low stock
    /// </summary>
    [UseFiltering]
    [UsePaging]
    [UseSorting]
    public async Task<IQueryable<ProductDto>> GetLowStockProducts(
        int threshold,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetLowStockProductsQuery { Threshold = threshold }, cancellationToken);
        return result.AsQueryable();
    }
}

[ExtendObjectType("Query")]
public class CategoryQueries
{
    /// <summary>
    /// Gets all categories with optional filtering and pagination
    /// </summary>
    [UseFiltering]
    [UsePaging]
    [UseSorting]
    public async Task<IQueryable<CategoryDto>> GetCategories(
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetAllCategoriesQuery(), cancellationToken);
        return result.AsQueryable();
    }

    /// <summary>
    /// Gets a specific category by ID
    /// </summary>
    public async Task<CategoryDto?> GetCategory(
        string id,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetCategoryByIdQuery { Id = id }, cancellationToken);
        return result;
    }

    /// <summary>
    /// Gets active categories
    /// </summary>
    [UseFiltering]
    [UsePaging]
    [UseSorting]
    public async Task<IQueryable<CategoryDto>> GetActiveCategories(
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetActiveCategoriesQuery(), cancellationToken);
        return result.AsQueryable();
    }
}
