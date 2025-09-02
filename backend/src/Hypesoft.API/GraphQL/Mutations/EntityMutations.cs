using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.API.GraphQL.Types;
using MediatR;
using HotChocolate;

namespace Hypesoft.API.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class ProductMutations
{
    /// <summary>
    /// Creates a new product
    /// </summary>
    public async Task<ProductPayload> CreateProduct(
        CreateProductInput input,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new CreateProductCommand
            {
                Name = input.Name,
                Description = input.Description,
                Price = input.Price,
                StockQuantity = input.StockQuantity,
                CategoryId = input.CategoryId
            };

            var result = await mediator.Send(command, cancellationToken);
            return new ProductPayload { Product = result };
        }
        catch (Exception ex)
        {
            return new ProductPayload { ErrorMessage = $"Error creating product: {ex.Message}" };
        }
    }

    /// <summary>
    /// Updates an existing product
    /// </summary>
    public async Task<ProductPayload> UpdateProduct(
        UpdateProductInput input,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new UpdateProductCommand
            {
                Id = input.Id,
                Name = input.Name ?? string.Empty,
                Description = input.Description ?? string.Empty,
                Price = input.Price ?? 0,
                CategoryId = input.CategoryId ?? string.Empty
            };

            var result = await mediator.Send(command, cancellationToken);
            return new ProductPayload { Product = result };
        }
        catch (Exception ex)
        {
            return new ProductPayload { ErrorMessage = $"Error updating product: {ex.Message}" };
        }
    }

    /// <summary>
    /// Deletes a product
    /// </summary>
    public async Task<DeletePayload> DeleteProduct(
        string id,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new DeleteProductCommand { Id = id };
            var success = await mediator.Send(command, cancellationToken);

            return new DeletePayload
            {
                Success = success,
                DeletedId = success ? id : null,
                ErrorMessage = success ? null : "Product not found"
            };
        }
        catch (Exception ex)
        {
            return new DeletePayload { Success = false, ErrorMessage = $"Error deleting product: {ex.Message}" };
        }
    }
}

[ExtendObjectType("Mutation")]
public class CategoryMutations
{
    /// <summary>
    /// Creates a new category
    /// </summary>
    public async Task<CategoryPayload> CreateCategory(
        CreateCategoryInput input,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new CreateCategoryCommand
            {
                Name = input.Name,
                Description = input.Description
            };

            var result = await mediator.Send(command, cancellationToken);
            return new CategoryPayload { Category = result };
        }
        catch (Exception ex)
        {
            return new CategoryPayload { ErrorMessage = $"Error creating category: {ex.Message}" };
        }
    }

    /// <summary>
    /// Updates an existing category
    /// </summary>
    public async Task<CategoryPayload> UpdateCategory(
        UpdateCategoryInput input,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new UpdateCategoryCommand
            {
                Id = input.Id,
                Name = input.Name ?? string.Empty,
                Description = input.Description ?? string.Empty
            };

            var result = await mediator.Send(command, cancellationToken);
            return new CategoryPayload { Category = result };
        }
        catch (Exception ex)
        {
            return new CategoryPayload { ErrorMessage = $"Error updating category: {ex.Message}" };
        }
    }

    /// <summary>
    /// Deletes a category
    /// </summary>
    public async Task<DeletePayload> DeleteCategory(
        string id,
        [Service] IMediator mediator,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new DeleteCategoryCommand { Id = id };
            var success = await mediator.Send(command, cancellationToken);

            return new DeletePayload
            {
                Success = success,
                DeletedId = success ? id : null,
                ErrorMessage = success ? null : "Category not found"
            };
        }
        catch (Exception ex)
        {
            return new DeletePayload { Success = false, ErrorMessage = $"Error deleting category: {ex.Message}" };
        }
    }
}
