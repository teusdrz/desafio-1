using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Commands;

public class CreateCategoryCommand : IRequest<CategoryDto>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateCategoryCommand : IRequest<CategoryDto>
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class DeleteCategoryCommand : IRequest<bool>
{
    public string Id { get; set; } = string.Empty;
}
