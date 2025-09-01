using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.API.Authorization;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(IMediator mediator, ILogger<CategoriesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    [Permission(Permissions.CategoryRead)]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories(CancellationToken cancellationToken = default)
    {
        var query = new GetAllCategoriesQuery();
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("active")]
    [Permission(Permissions.CategoryRead)]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetActiveCategories(CancellationToken cancellationToken = default)
    {
        var query = new GetActiveCategoriesQuery();
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Permission(Permissions.CategoryRead)]
    public async Task<ActionResult<CategoryDto>> GetCategory(string id, CancellationToken cancellationToken = default)
    {
        var query = new GetCategoryByIdQuery { Id = id };
        var result = await _mediator.Send(query, cancellationToken);

        if (result == null)
            return NotFound($"Category with ID {id} not found");

        return Ok(result);
    }

    [HttpGet("stats")]
    [Permission(Permissions.ReportView)]
    public async Task<ActionResult<IEnumerable<CategoryStatsDto>>> GetCategoryStats(CancellationToken cancellationToken = default)
    {
        var query = new GetCategoryStatsQuery();
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Permission(Permissions.CategoryCreate)]
    public async Task<ActionResult<CategoryDto>> CreateCategory(
        CreateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetCategory), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Permission(Permissions.CategoryUpdate)]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(
        string id,
        UpdateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        command.Id = id;
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Permission(Permissions.CategoryDelete)]
    public async Task<ActionResult> DeleteCategory(string id, CancellationToken cancellationToken = default)
    {
        var command = new DeleteCategoryCommand { Id = id };
        var result = await _mediator.Send(command, cancellationToken);

        if (!result)
            return NotFound($"Category with ID {id} not found");

        return NoContent();
    }
}
