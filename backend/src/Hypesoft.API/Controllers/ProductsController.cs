using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.API.Authorization;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[EnableRateLimiting("ApiPolicy")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    [Permission(Permissions.ProductRead)]
    public async Task<ActionResult<ProductListDto>> GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? categoryId = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProductsPaginatedQuery
        {
            Page = page,
            PageSize = pageSize,
            SearchTerm = searchTerm,
            CategoryId = categoryId
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Permission(Permissions.ProductRead)]
    public async Task<ActionResult<ProductDto>> GetProduct(string id, CancellationToken cancellationToken = default)
    {
        var query = new GetProductByIdQuery { Id = id };
        var result = await _mediator.Send(query, cancellationToken);

        if (result == null)
            return NotFound($"Product with ID {id} not found");

        return Ok(result);
    }

    [HttpGet("search")]
    [Permission(Permissions.ProductRead)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> SearchProducts(
        [FromQuery] string name,
        CancellationToken cancellationToken = default)
    {
        var query = new SearchProductsByNameQuery { Name = name };
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("category/{categoryId}")]
    [Permission(Permissions.ProductRead)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(
        string categoryId,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProductsByCategoryQuery { CategoryId = categoryId };
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("low-stock")]
    [Permission(Permissions.ReportView)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetLowStockProducts(
        [FromQuery] int threshold = 10,
        CancellationToken cancellationToken = default)
    {
        var query = new GetLowStockProductsQuery { Threshold = threshold };
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Permission(Permissions.ProductCreate)]
    public async Task<ActionResult<ProductDto>> CreateProduct(
        CreateProductCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetProduct), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Permission(Permissions.ProductUpdate)]
    public async Task<ActionResult<ProductDto>> UpdateProduct(
        string id,
        UpdateProductCommand command,
        CancellationToken cancellationToken = default)
    {
        command.Id = id;
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{id}/stock")]
    [Permission(Permissions.StockUpdate)]
    public async Task<ActionResult<ProductDto>> UpdateProductStock(
        string id,
        UpdateProductStockCommand command,
        CancellationToken cancellationToken = default)
    {
        command.Id = id;
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Permission(Permissions.ProductDelete)]
    public async Task<ActionResult> DeleteProduct(string id, CancellationToken cancellationToken = default)
    {
        var command = new DeleteProductCommand { Id = id };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result)
            return NotFound($"Product with ID {id} not found");

        return NoContent();
    }
}
