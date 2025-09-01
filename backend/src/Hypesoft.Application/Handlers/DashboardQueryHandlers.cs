using AutoMapper;
using MediatR;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Application.Handlers;

public class DashboardQueryHandlers : IRequestHandler<GetDashboardDataQuery, DashboardDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public DashboardQueryHandlers(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<DashboardDto> Handle(GetDashboardDataQuery request, CancellationToken cancellationToken)
    {
        var totalProducts = await _productRepository.CountAsync(cancellationToken);
        var totalStockValue = await _productRepository.GetTotalStockValueAsync(cancellationToken);
        var lowStockProducts = await _productRepository.GetLowStockProductsAsync(10, cancellationToken);

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

        return new DashboardDto
        {
            TotalProducts = totalProducts,
            TotalStockValue = totalStockValue,
            LowStockProductsCount = lowStockProducts.Count(),
            LowStockProducts = _mapper.Map<IEnumerable<ProductDto>>(lowStockProducts),
            CategoryStats = categoryStats
        };
    }
}
