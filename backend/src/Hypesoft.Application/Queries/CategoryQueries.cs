using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries;

public class GetCategoryByIdQuery : IRequest<CategoryDto?>
{
    public string Id { get; set; } = string.Empty;
}

public class GetAllCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
{
}

public class GetActiveCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
{
}

public class GetCategoryStatsQuery : IRequest<IEnumerable<CategoryStatsDto>>
{
}
