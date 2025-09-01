using AutoMapper;
using MediatR;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class CategoryCommandHandlers :
    IRequestHandler<CreateCategoryCommand, CategoryDto>,
    IRequestHandler<UpdateCategoryCommand, CategoryDto>,
    IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoryCommandHandlers(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var existingCategory = await _categoryRepository.GetByNameAsync(request.Name, cancellationToken);
        if (existingCategory != null)
            throw new ArgumentException($"Category with name '{request.Name}' already exists");

        var category = Category.Create(request.Name, request.Description);
        await _categoryRepository.AddAsync(category, cancellationToken);

        return _mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        if (category == null)
            throw new ArgumentException($"Category with ID {request.Id} not found");

        var existingCategory = await _categoryRepository.GetByNameAsync(request.Name, cancellationToken);
        if (existingCategory != null && existingCategory.Id != request.Id)
            throw new ArgumentException($"Category with name '{request.Name}' already exists");

        category.UpdateInfo(request.Name, request.Description);
        await _categoryRepository.UpdateAsync(category, cancellationToken);

        return _mapper.Map<CategoryDto>(category);
    }

    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        if (category == null)
            return false;

        var hasProducts = await _categoryRepository.HasProductsAsync(request.Id, cancellationToken);
        if (hasProducts)
            throw new InvalidOperationException("Cannot delete category that has products associated");

        await _categoryRepository.DeleteAsync(request.Id, cancellationToken);
        return true;
    }
}
