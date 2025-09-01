using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Common.Models;
using Hypesoft.API.Authorization;
using Swashbuckle.AspNetCore.Annotations;

namespace Hypesoft.API.Controllers;

/// <summary>
/// Controller for managing products with comprehensive CRUD operations and advanced querying.
/// Provides endpoints for product management, inventory tracking, and analytics.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
[EnableRateLimiting("ApiPolicy")]
[SwaggerTag("Products", "Comprehensive product management with advanced querying and inventory tracking")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    /// <summary>
    /// Initializes a new instance of the ProductsController.
    /// </summary>
    /// <param name="mediator">The mediator for handling commands and queries.</param>
    /// <param name="logger">The logger instance.</param>
    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets a paginated list of products with advanced filtering and sorting options.
    /// </summary>
    /// <param name="pageNumber">The page number (1-based). Default: 1</param>
    /// <param name="pageSize">The number of items per page (1-100). Default: 10</param>
    /// <param name="searchTerm">Optional search term for product name or description</param>
    /// <param name="categoryId">Optional category filter</param>
    /// <param name="minPrice">Optional minimum price filter</param>
    /// <param name="maxPrice">Optional maximum price filter</param>
    /// <param name="lowStockOnly">Optional filter to show only low stock products</param>
    /// <param name="sortBy">Field to sort by (Name, Price, StockQuantity, CreatedAt). Default: Name</param>
    /// <param name="sortDirection">Sort direction (asc, desc). Default: asc</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A paginated list of products</returns>
    /// <response code="200">Successfully retrieved products</response>
    /// <response code="400">Invalid request parameters</response>
    /// <response code="401">Authentication required</response>
    /// <response code="429">Rate limit exceeded</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [Permission(Permissions.ProductRead)]
    [SwaggerOperation(
        Summary = "Get paginated products",
        Description = @"
Retrieves a paginated list of products with comprehensive filtering and sorting capabilities.

**Features:**
- **Pagination**: Efficiently handles large product catalogs
- **Full-text Search**: Search across product names and descriptions
- **Category Filtering**: Filter by specific product categories
- **Price Range**: Filter by minimum and maximum price
- **Stock Filtering**: Show only low stock products
- **Advanced Sorting**: Sort by multiple fields with ascending/descending order
- **Performance Optimized**: Results are cached for improved response times

**Caching:**
- Results are cached for 5 minutes
- Cache varies by all query parameters
- Authenticated users get personalized cache keys

**Rate Limiting:**
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour
- Premium users: 5000 requests/hour
"
    )]
    [SwaggerResponse(200, "Successfully retrieved products", typeof(PaginatedResult<ProductDto>))]
    [SwaggerResponse(400, "Invalid request parameters", typeof(ValidationProblemDetails))]
    [SwaggerResponse(401, "Authentication required")]
    [SwaggerResponse(429, "Rate limit exceeded")]
    [SwaggerResponse(500, "Internal server error")]
    [ProducesResponseType(typeof(PaginatedResult<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PaginatedResult<ProductDto>>> GetProducts(
        [FromQuery, SwaggerParameter("Page number (1-based)", Required = false)] int pageNumber = 1,
        [FromQuery, SwaggerParameter("Items per page (1-100)", Required = false)] int pageSize = 10,
        [FromQuery, SwaggerParameter("Search term for name/description", Required = false)] string? searchTerm = null,
        [FromQuery, SwaggerParameter("Category filter", Required = false)] string? categoryId = null,
        [FromQuery, SwaggerParameter("Minimum price filter", Required = false)] decimal? minPrice = null,
        [FromQuery, SwaggerParameter("Maximum price filter", Required = false)] decimal? maxPrice = null,
        [FromQuery, SwaggerParameter("Show only low stock products", Required = false)] bool? lowStockOnly = null,
        [FromQuery, SwaggerParameter("Sort field (Name, Price, StockQuantity, CreatedAt)", Required = false)] string sortBy = "Name",
        [FromQuery, SwaggerParameter("Sort direction (asc, desc)", Required = false)] string sortDirection = "asc",
        CancellationToken cancellationToken = default)
    {
        var query = new GetProductsQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SearchTerm = searchTerm,
            CategoryId = categoryId,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            LowStockOnly = lowStockOnly,
            SortBy = sortBy,
            SortDirection = sortDirection
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a specific product by its unique identifier.
    /// </summary>
    /// <param name="id">The unique product identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The product details</returns>
    /// <response code="200">Successfully retrieved product</response>
    /// <response code="400">Invalid product ID format</response>
    /// <response code="401">Authentication required</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [Permission(Permissions.ProductRead)]
    [SwaggerOperation(
        Summary = "Get product by ID",
        Description = @"
Retrieves detailed information about a specific product by its unique identifier.

**Features:**
- **Detailed Product Information**: Complete product data including metadata
- **Real-time Stock**: Current stock levels and availability
- **Category Information**: Associated category details
- **Audit Information**: Creation and modification timestamps
- **Performance Optimized**: Individual products are cached for 15 minutes

**Cache Strategy:**
- Product details cached for 15 minutes
- Cache invalidated on product updates
- ETag support for conditional requests
"
    )]
    [SwaggerResponse(200, "Successfully retrieved product", typeof(ProductDto))]
    [SwaggerResponse(400, "Invalid product ID format")]
    [SwaggerResponse(401, "Authentication required")]
    [SwaggerResponse(404, "Product not found")]
    [SwaggerResponse(500, "Internal server error")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProductDto>> GetProduct(
        [FromRoute, SwaggerParameter("Product unique identifier", Required = true)] string id,
        CancellationToken cancellationToken = default)
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
