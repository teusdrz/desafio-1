using FluentAssertions;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Distributed;
using AutoMapper;
using Hypesoft.Application.Handlers.Queries;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.UnitTests.Application.Handlers;

/// <summary>
/// Comprehensive unit tests for GetProductsQueryHandler.
/// Tests all scenarios including caching, error handling, and edge cases.
/// </summary>
public class GetProductsQueryHandlerTests
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<ILogger<GetProductsQueryHandler>> _mockLogger;
    private readonly Mock<IDistributedCache> _mockCache;
    private readonly GetProductsQueryHandler _handler;

    public GetProductsQueryHandlerTests()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockLogger = new Mock<ILogger<GetProductsQueryHandler>>();
        _mockCache = new Mock<IDistributedCache>();

        _handler = new GetProductsQueryHandler(
            _mockProductRepository.Object,
            _mockMapper.Object,
            _mockLogger.Object,
            _mockCache.Object);
    }

    [Fact]
    public async Task Handle_ValidQuery_ShouldReturnPaginatedResult()
    {
        // Arrange
        var query = new GetProductsQuery
        {
            PageNumber = 1,
            PageSize = 10,
            SearchTerm = "test"
        };

        var products = new List<Product>
        {
            CreateTestProduct("1", "Test Product 1"),
            CreateTestProduct("2", "Test Product 2")
        };

        var productDtos = new List<ProductDto>
        {
            new() { Id = "1", Name = "Test Product 1" },
            new() { Id = "2", Name = "Test Product 2" }
        };

        _mockCache.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync((byte[])null!);

        _mockProductRepository.Setup(x => x.GetPaginatedAsync(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal?>(), It.IsAny<decimal?>(), It.IsAny<bool?>(),
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((products, 2));

        _mockMapper.Setup(x => x.Map<List<ProductDto>>(It.IsAny<List<Product>>()))
                  .Returns(productDtos);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(2);
        result.PageNumber.Should().Be(1);
        result.PageSize.Should().Be(10);
        result.TotalCount.Should().Be(2);
        result.TotalPages.Should().Be(1);
        result.HasPreviousPage.Should().BeFalse();
        result.HasNextPage.Should().BeFalse();
    }

    [Fact]
    public async Task Handle_InvalidQuery_ShouldThrowArgumentException()
    {
        // Arrange
        var invalidQuery = new GetProductsQuery
        {
            PageNumber = 0, // Invalid page number
            PageSize = 10
        };

        // Act & Assert
        await FluentActions.Invoking(() => _handler.Handle(invalidQuery, CancellationToken.None))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("Invalid query parameters");
    }

    [Fact]
    public async Task Handle_CachedResult_ShouldReturnFromCache()
    {
        // Arrange
        var query = new GetProductsQuery { PageNumber = 1, PageSize = 10 };
        var cachedData = """{"Items":[],"PageNumber":1,"PageSize":10,"TotalCount":0}""";
        var cachedBytes = System.Text.Encoding.UTF8.GetBytes(cachedData);

        _mockCache.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync(cachedBytes);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().BeEmpty();
        result.PageNumber.Should().Be(1);
        result.TotalCount.Should().Be(0);

        // Verify repository was not called
        _mockProductRepository.Verify(x => x.GetPaginatedAsync(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal?>(), It.IsAny<decimal?>(), It.IsAny<bool?>(),
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_RepositoryThrowsException_ShouldLogErrorAndRethrow()
    {
        // Arrange
        var query = new GetProductsQuery { PageNumber = 1, PageSize = 10 };
        var expectedException = new InvalidOperationException("Database error");

        _mockCache.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync((byte[])null!);

        _mockProductRepository.Setup(x => x.GetPaginatedAsync(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal?>(), It.IsAny<decimal?>(), It.IsAny<bool?>(),
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        await FluentActions.Invoking(() => _handler.Handle(query, CancellationToken.None))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Database error");

        // Verify error was logged
        VerifyLoggerWasCalled(LogLevel.Error);
    }

    [Theory]
    [InlineData(1, 10, 100, 10, true, false)]  // First page
    [InlineData(5, 10, 100, 10, true, true)]   // Middle page
    [InlineData(10, 10, 100, 10, true, false)] // Last page
    [InlineData(1, 50, 25, 1, false, false)]   // Single page
    public async Task Handle_DifferentPagination_ShouldCalculateCorrectMetadata(
        int pageNumber, int pageSize, int totalCount, int expectedTotalPages,
        bool expectedHasPrevious, bool expectedHasNext)
    {
        // Arrange
        var query = new GetProductsQuery { PageNumber = pageNumber, PageSize = pageSize };
        var products = new List<Product>();
        var productDtos = new List<ProductDto>();

        _mockCache.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync((byte[])null!);

        _mockProductRepository.Setup(x => x.GetPaginatedAsync(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal?>(), It.IsAny<decimal?>(), It.IsAny<bool?>(),
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((products, totalCount));

        _mockMapper.Setup(x => x.Map<List<ProductDto>>(It.IsAny<List<Product>>()))
                  .Returns(productDtos);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.TotalPages.Should().Be(expectedTotalPages);
        result.HasPreviousPage.Should().Be(expectedHasPrevious);
        result.HasNextPage.Should().Be(expectedHasNext);
    }

    [Fact]
    public async Task Handle_WithFilters_ShouldPassFiltersToRepository()
    {
        // Arrange
        var query = new GetProductsQuery
        {
            PageNumber = 1,
            PageSize = 10,
            SearchTerm = "laptop",
            CategoryId = "electronics",
            MinPrice = 100m,
            MaxPrice = 1000m,
            LowStockOnly = true,
            SortBy = "Price",
            SortDirection = "desc"
        };

        _mockCache.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync((byte[])null!);

        _mockProductRepository.Setup(x => x.GetPaginatedAsync(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal?>(), It.IsAny<decimal?>(), It.IsAny<bool?>(),
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((new List<Product>(), 0));

        _mockMapper.Setup(x => x.Map<List<ProductDto>>(It.IsAny<List<Product>>()))
                  .Returns(new List<ProductDto>());

        // Act
        await _handler.Handle(query, CancellationToken.None);

        // Assert
        _mockProductRepository.Verify(x => x.GetPaginatedAsync(
            1, 10, "laptop", "electronics", 100m, 1000m, true, "Price", "desc",
            It.IsAny<CancellationToken>()), Times.Once);
    }

    private static Product CreateTestProduct(string id, string name)
    {
        var product = Product.Create(name, "Test Description", 100m, "cat1", 50);
        // Use reflection to set the Id for testing
        typeof(Product).GetProperty(nameof(Product.Id))?.SetValue(product, id);
        return product;
    }

    private void VerifyLoggerWasCalled(LogLevel level)
    {
        _mockLogger.Verify(
            x => x.Log(
                level,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.AtLeastOnce);
    }
}
