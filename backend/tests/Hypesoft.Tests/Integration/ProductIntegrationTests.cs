using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using Xunit;
using Xunit.Abstractions;
using NUnit.Framework;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using MediatR;
using Hypesoft.API.Controllers;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Common.Models;
using Hypesoft.Domain.Entities;
using Hypesoft.Infrastructure.Data;
using Hypesoft.Infrastructure.Repositories;

namespace Hypesoft.Tests.Integration;

/// <summary>
/// Integration tests for the complete product management workflow.
/// Tests end-to-end scenarios including database operations, caching, and API responses.
/// </summary>
[TestFixture]
public class ProductIntegrationTests : IDisposable
{
    private readonly ITestOutputHelper _output;
    private readonly ApplicationDbContext _context;
    private readonly Mock<IDistributedCache> _mockCache;
    private readonly Mock<ILogger<ProductsController>> _mockLogger;
    private readonly Mock<IMediator> _mockMediator;
    private readonly ProductsController _controller;
    private readonly ProductRepository _repository;
    private readonly ServiceProvider _serviceProvider;

    /// <summary>
    /// Initializes the integration test environment with in-memory database and mocked dependencies.
    /// </summary>
    public ProductIntegrationTests()
    {
        // Setup in-memory database
        var services = new ServiceCollection();
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()));
        services.AddLogging();

        _serviceProvider = services.BuildServiceProvider();
        _context = _serviceProvider.GetRequiredService<ApplicationDbContext>();

        // Setup mocks
        _mockCache = new Mock<IDistributedCache>();
        _mockLogger = new Mock<ILogger<ProductsController>>();
        _mockMediator = new Mock<IMediator>();

        // Setup repository and controller
        var repoLogger = new Mock<ILogger<ProductRepository>>();
        _repository = new ProductRepository(_context, repoLogger.Object);
        _controller = new ProductsController(_mockMediator.Object, _mockLogger.Object);

        // Seed test data
        SeedTestData();
    }

    /// <summary>
    /// Seeds the test database with sample data for consistent testing.
    /// </summary>
    private void SeedTestData()
    {
        var category = Category.Create("electronics", "Electronics", "Electronic devices and gadgets");
        _context.Categories.Add(category);

        var products = new[]
        {
            Product.Create("Premium Laptop", "High-performance laptop for professionals", 1299.99m, 25, "electronics"),
            Product.Create("Wireless Mouse", "Ergonomic wireless mouse with precision tracking", 29.99m, 100, "electronics"),
            Product.Create("Gaming Keyboard", "Mechanical gaming keyboard with RGB lighting", 149.99m, 50, "electronics"),
            Product.Create("4K Monitor", "Ultra HD 4K monitor for professional use", 399.99m, 15, "electronics"),
            Product.Create("USB-C Hub", "Multi-port USB-C hub for connectivity", 49.99m, 5, "electronics") // Low stock item
        };

        foreach (var product in products)
        {
            _context.Products.Add(product);
        }

        _context.SaveChanges();
    }

    /// <summary>
    /// Tests the complete product creation workflow including validation, persistence, and domain events.
    /// </summary>
    [Test]
    public async Task CreateProduct_WithValidData_ShouldSucceedAndTriggerEvents()
    {
        // Arrange
        var product = Product.Create(
            "Test Product",
            "A test product for integration testing",
            99.99m,
            50,
            "electronics"
        );

        // Act
        await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        // Assert
        var savedProduct = await _repository.GetByIdAsync(product.Id);
        Xunit.Assert.NotNull(savedProduct);
        Xunit.Assert.Equal("Test Product", savedProduct.Name);
        Xunit.Assert.Equal(99.99m, savedProduct.Price.Value);
        Xunit.Assert.Equal(50, savedProduct.StockQuantity.Value);

        // Verify domain events were added
        Xunit.Assert.NotEmpty(savedProduct.DomainEvents);
        Xunit.Assert.Contains(savedProduct.DomainEvents, e => e.GetType().Name == "ProductCreatedDomainEvent");
    }

    /// <summary>
    /// Tests the advanced pagination functionality with filtering and sorting.
    /// </summary>
    [Test]
    public async Task GetPaginatedProducts_WithFiltersAndSorting_ShouldReturnCorrectResults()
    {
        // Arrange
        var pageNumber = 1;
        var pageSize = 3;
        var searchTerm = "laptop";
        var minPrice = 100m;
        var sortBy = "Price";
        var sortDirection = "desc";

        // Act
        var (products, totalCount) = await _repository.GetPaginatedAsync(
            pageNumber, pageSize, searchTerm, null, minPrice, null, null, sortBy, sortDirection);

        // Assert
        var productList = products.ToList();
        Xunit.Assert.Single(productList); // Only Premium Laptop matches criteria
        Xunit.Assert.Equal(1, totalCount);
        Xunit.Assert.Equal("Premium Laptop", productList[0].Name);
        Xunit.Assert.True(productList[0].Price.Value >= minPrice);
    }

    /// <summary>
    /// Tests low stock product identification with configurable thresholds.
    /// </summary>
    [Test]
    public async Task GetLowStockProducts_WithThreshold_ShouldReturnCorrectItems()
    {
        // Arrange
        var threshold = 10;

        // Act
        var lowStockProducts = await _repository.GetLowStockProductsAsync(threshold);

        // Assert
        var productList = lowStockProducts.ToList();
        Xunit.Assert.Single(productList); // Only USB-C Hub has stock <= 10
        Xunit.Assert.Equal("USB-C Hub", productList[0].Name);
        Xunit.Assert.True(productList[0].StockQuantity.Value <= threshold);
    }

    /// <summary>
    /// Tests bulk stock update functionality with transaction safety.
    /// </summary>
    [Test]
    public async Task BulkUpdateStock_WithValidData_ShouldUpdateAllProducts()
    {
        // Arrange
        var allProducts = await _repository.GetAllAsync();
        var stockUpdates = allProducts.Take(2).ToDictionary(p => p.Id, p => p.StockQuantity.Value + 10);

        // Act
        await _repository.BulkUpdateStockAsync(stockUpdates);

        // Assert
        foreach (var kvp in stockUpdates)
        {
            var product = await _repository.GetByIdAsync(kvp.Key);
            Xunit.Assert.NotNull(product);
            Xunit.Assert.Equal(kvp.Value, product.StockQuantity.Value);
        }
    }

    /// <summary>
    /// Tests product search functionality with case-insensitive matching.
    /// </summary>
    [Test]
    public async Task SearchByName_WithPartialMatch_ShouldReturnMatchingProducts()
    {
        // Arrange
        var searchTerm = "mouse";

        // Act
        var searchResults = await _repository.SearchByNameAsync(searchTerm);

        // Assert
        var resultList = searchResults.ToList();
        Xunit.Assert.Single(resultList);
        Xunit.Assert.Equal("Wireless Mouse", resultList[0].Name);
    }

    /// <summary>
    /// Tests category-based product filtering.
    /// </summary>
    [Test]
    public async Task GetByCategory_WithValidCategory_ShouldReturnCategoryProducts()
    {
        // Arrange
        var categoryId = "electronics";

        // Act
        var categoryProducts = await _repository.GetByCategoryIdAsync(categoryId);

        // Assert
        var productList = categoryProducts.ToList();
        Xunit.Assert.Equal(5, productList.Count);
        Xunit.Assert.All(productList, p => Xunit.Assert.Equal(categoryId, p.CategoryId));
    }

    /// <summary>
    /// Tests total stock value calculation across all products.
    /// </summary>
    [Test]
    public async Task GetTotalStockValue_ShouldCalculateCorrectValue()
    {
        // Act
        var totalValue = await _repository.GetTotalStockValueAsync();

        // Assert
        var expectedValue = (1299.99m * 25) + (29.99m * 100) + (149.99m * 50) + (399.99m * 15) + (49.99m * 5);
        Xunit.Assert.Equal(expectedValue, totalValue);
    }

    /// <summary>
    /// Tests category count calculation for inventory analytics.
    /// </summary>
    [Test]
    public async Task GetCategoriesCount_ShouldReturnCorrectCounts()
    {
        // Act
        var categoryCounts = await _repository.GetCategoriesCountAsync();

        // Assert
        Xunit.Assert.Single(categoryCounts);
        Xunit.Assert.Equal(5, categoryCounts["electronics"]);
    }

    /// <summary>
    /// Tests price range calculation for filter boundaries.
    /// </summary>
    [Test]
    public async Task GetPriceRange_ShouldReturnMinAndMaxPrices()
    {
        // Act
        var (minPrice, maxPrice) = await _repository.GetPriceRangeAsync();

        // Assert
        Xunit.Assert.Equal(29.99m, minPrice);
        Xunit.Assert.Equal(1299.99m, maxPrice);
    }

    /// <summary>
    /// Tests trending products functionality based on creation date.
    /// </summary>
    [Test]
    public async Task GetTrendingProducts_WithLimit_ShouldReturnRecentProducts()
    {
        // Arrange
        var limit = 3;

        // Act
        var trendingProducts = await _repository.GetTrendingProductsAsync(limit);

        // Assert
        var productList = trendingProducts.ToList();
        Xunit.Assert.Equal(3, productList.Count);

        // Verify they are ordered by creation date (most recent first)
        for (int i = 0; i < productList.Count - 1; i++)
        {
            Xunit.Assert.True(productList[i].CreatedAt >= productList[i + 1].CreatedAt);
        }
    }

    /// <summary>
    /// Tests product stock update with domain event generation.
    /// </summary>
    [Test]
    public async Task UpdateProductStock_ShouldTriggerLowStockEvent()
    {
        // Arrange
        var product = await _repository.SearchByNameAsync("USB-C Hub");
        var testProduct = product.First();
        var originalEventCount = testProduct.DomainEvents.Count;

        // Act
        testProduct.UpdateStock(3); // Update to very low stock
        await _repository.UpdateAsync(testProduct);

        // Assert
        Xunit.Assert.True(testProduct.DomainEvents.Count > originalEventCount);
        Xunit.Assert.Contains(testProduct.DomainEvents, e => e.GetType().Name == "LowStockDomainEvent");
    }

    /// <summary>
    /// Tests product business rule validation for negative stock.
    /// </summary>
    [Test]
    public void UpdateProductStock_WithNegativeValue_ShouldThrowException()
    {
        // Arrange
        var product = Product.Create("Test Product", "Test", 10m, 10, "electronics");

        // Act & Assert
        Xunit.Assert.Throws<ArgumentException>(() => product.UpdateStock(-1));
    }

    /// <summary>
    /// Tests product creation with invalid data to verify validation.
    /// </summary>
    [Test]
    public void CreateProduct_WithInvalidData_ShouldThrowValidationException()
    {
        // Act & Assert - Empty name
        Xunit.Assert.Throws<ArgumentException>(() =>
            Product.Create("", "Valid description", 10m, 10, "electronics"));

        // Act & Assert - Negative price
        Xunit.Assert.Throws<ArgumentException>(() =>
            Product.Create("Valid Name", "Valid description", -10m, 10, "electronics"));

        // Act & Assert - Negative stock
        Xunit.Assert.Throws<ArgumentException>(() =>
            Product.Create("Valid Name", "Valid description", 10m, -10, "electronics"));
    }

    /// <summary>
    /// Tests pagination edge cases with large page numbers.
    /// </summary>
    [Test]
    public async Task GetPaginatedProducts_WithLargePageNumber_ShouldReturnEmptyResult()
    {
        // Arrange
        var pageNumber = 100;
        var pageSize = 10;

        // Act
        var (products, totalCount) = await _repository.GetPaginatedAsync(pageNumber, pageSize);

        // Assert
        Xunit.Assert.Empty(products);
        Xunit.Assert.Equal(5, totalCount); // Total count should still be accurate
    }

    /// <summary>
    /// Tests search functionality with special characters and edge cases.
    /// </summary>
    [Test]
    public async Task SearchByName_WithSpecialCharacters_ShouldHandleGracefully()
    {
        // Arrange
        var searchTerms = new[] { "", "   ", "!@#$%", "nonexistent" };

        foreach (var searchTerm in searchTerms)
        {
            // Act
            var results = await _repository.SearchByNameAsync(searchTerm);

            // Assert
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                Xunit.Assert.Empty(results);
            }
            else
            {
                // Should not throw exception
                Xunit.Assert.NotNull(results);
            }
        }
    }

    /// <summary>
    /// Tests concurrent access scenarios for thread safety.
    /// </summary>
    [Test]
    public async Task ConcurrentProductUpdates_ShouldMaintainDataIntegrity()
    {
        // Arrange
        var product = await _repository.SearchByNameAsync("Premium Laptop");
        var testProduct = product.First();
        var tasks = new List<Task>();

        // Act - Simulate concurrent updates
        for (int i = 0; i < 5; i++)
        {
            var index = i;
            tasks.Add(Task.Run(async () =>
            {
                var productCopy = await _repository.GetByIdAsync(testProduct.Id);
                if (productCopy != null)
                {
                    productCopy.UpdateStock(testProduct.StockQuantity.Value + index);
                    await _repository.UpdateAsync(productCopy);
                }
            }));
        }

        await Task.WhenAll(tasks);

        // Assert - Verify final state is consistent
        var finalProduct = await _repository.GetByIdAsync(testProduct.Id);
        Xunit.Assert.NotNull(finalProduct);
        Xunit.Assert.True(finalProduct.StockQuantity.Value >= testProduct.StockQuantity.Value);
    }

    /// <summary>
    /// Disposes test resources and cleans up the test environment.
    /// </summary>
    public void Dispose()
    {
        _context?.Dispose();
        _serviceProvider?.Dispose();
    }
}

/// <summary>
/// Performance tests for product operations under load.
/// Tests system behavior with large datasets and concurrent operations.
/// </summary>
[TestFixture]
public class ProductPerformanceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly ProductRepository _repository;
    private readonly ServiceProvider _serviceProvider;

    /// <summary>
    /// Initializes the performance test environment with seeded data.
    /// </summary>
    public ProductPerformanceTests()
    {
        var services = new ServiceCollection();
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()));
        services.AddLogging();

        _serviceProvider = services.BuildServiceProvider();
        _context = _serviceProvider.GetRequiredService<ApplicationDbContext>();

        var logger = new Mock<ILogger<ProductRepository>>();
        _repository = new ProductRepository(_context, logger.Object);

        SeedLargeDataset();
    }

    /// <summary>
    /// Seeds a large dataset for performance testing.
    /// </summary>
    private void SeedLargeDataset()
    {
        var category = Category.Create("electronics", "Electronics", "Electronic devices");
        _context.Categories.Add(category);

        var products = new List<Product>();
        for (int i = 1; i <= 1000; i++)
        {
            var product = Product.Create(
                $"Product {i}",
                $"Description for product {i}",
                Math.Round((decimal)(10 + (i * 0.5)), 2),
                50 + (i % 100),
                "electronics"
            );
            products.Add(product);
        }

        _context.Products.AddRange(products);
        _context.SaveChanges();
    }

    /// <summary>
    /// Tests pagination performance with large datasets.
    /// </summary>
    [Test]
    public async Task GetPaginatedProducts_WithLargeDataset_ShouldPerformWell()
    {
        // Arrange
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        // Act
        var (products, totalCount) = await _repository.GetPaginatedAsync(1, 50);

        // Assert
        stopwatch.Stop();
        Xunit.Assert.Equal(50, products.Count());
        Xunit.Assert.Equal(1000, totalCount);
        Xunit.Assert.True(stopwatch.ElapsedMilliseconds < 1000, "Pagination should complete within 1 second");
    }

    /// <summary>
    /// Tests search performance across large datasets.
    /// </summary>
    [Test]
    public async Task SearchProducts_WithLargeDataset_ShouldPerformWell()
    {
        // Arrange
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        // Act
        var results = await _repository.SearchByNameAsync("Product 5");

        // Assert
        stopwatch.Stop();
        Xunit.Assert.NotEmpty(results);
        Xunit.Assert.True(stopwatch.ElapsedMilliseconds < 500, "Search should complete within 500ms");
    }

    /// <summary>
    /// Tests bulk operations performance.
    /// </summary>
    [Test]
    public async Task BulkUpdateStock_WithManyProducts_ShouldPerformWell()
    {
        // Arrange
        var products = await _repository.GetPaginatedAsync(1, 100);
        var stockUpdates = products.Item1.ToDictionary(p => p.Id, p => p.StockQuantity.Value + 10);
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        // Act
        await _repository.BulkUpdateStockAsync(stockUpdates);

        // Assert
        stopwatch.Stop();
        Xunit.Assert.True(stopwatch.ElapsedMilliseconds < 2000, "Bulk update should complete within 2 seconds");
    }

    /// <summary>
    /// Disposes performance test resources.
    /// </summary>
    public void Dispose()
    {
        _context?.Dispose();
        _serviceProvider?.Dispose();
    }
}
