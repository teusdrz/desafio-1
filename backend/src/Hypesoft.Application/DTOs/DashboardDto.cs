namespace Hypesoft.Application.DTOs;

public class DashboardDto
{
    public int TotalProducts { get; set; }
    public decimal TotalStockValue { get; set; }
    public int LowStockProductsCount { get; set; }
    public IEnumerable<ProductDto> LowStockProducts { get; set; } = Enumerable.Empty<ProductDto>();
    public IEnumerable<CategoryStatsDto> CategoryStats { get; set; } = Enumerable.Empty<CategoryStatsDto>();
}

public class DashboardStatsDto
{
    public string Label { get; set; } = string.Empty;
    public int Value { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}
