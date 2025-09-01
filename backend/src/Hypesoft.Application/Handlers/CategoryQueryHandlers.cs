using AutoMapper;
using MediatR;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class CategoryQueryHandlers :
    IRequestHandler<GetCategoryByIdQuery, CategoryDto?>,
    IRequestHandler<GetAllCategoriesQuery, IEnumerable<CategoryDto>>,
    IRequestHandler<GetActiveCategoriesQuery, IEnumerable<CategoryDto>>,
    IRequestHandler<GetCategoryStatsQuery, IEnumerable<CategoryStatsDto>>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public CategoryQueryHandlers(
        ICategoryRepository categoryRepository,
        IProductRepository productRepository,
        IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        return category == null ? null : _mapper.Map<CategoryDto>(category);
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetActiveCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetActiveAsync(cancellationToken);
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    public async Task<IEnumerable<CategoryStatsDto>> Handle(GetCategoryStatsQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetCategoriesWithProductCountAsync(cancellationToken);

        var categoryStats = new List<CategoryStatsDto>();

        foreach (var category in categories)
        {
            var products = await _productRepository.GetByCategoryIdAsync(category.Id, cancellationToken);
            var totalValue = products.Sum(p => p.Price.Value * p.StockQuantity.Value);

            categoryStats.Add(new CategoryStatsDto
            {
                CategoryId = category.Id,
                CategoryName = category.Name,
                ProductsCount = category.Products.Count,
                TotalValue = totalValue
            });
        }

        return categoryStats;
    }
}
