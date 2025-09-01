using AutoMapper;
using Hypesoft.Application.Commands;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Hypesoft.UnitTests.Application.Handlers;

public class ProductCommandHandlerTests
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<ICategoryRepository> _mockCategoryRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<ILogger<ProductCommandHandler>> _mockLogger;
    private readonly ProductCommandHandler _handler;

    public ProductCommandHandlerTests()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockCategoryRepository = new Mock<ICategoryRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockLogger = new Mock<ILogger<ProductCommandHandler>>();

        _handler = new ProductCommandHandler(
            _mockProductRepository.Object,
            _mockCategoryRepository.Object,
            _mockMapper.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task Handle_CreateProductCommand_WithValidData_ShouldReturnProductDto()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            Description = "Test Description",
            Price = 100.50m,
            CategoryId = "cat123",
            StockQuantity = 50
        };

        var category = Category.Create("Electronics", "Electronic products");
        var product = Product.Create(command.Name, command.Description, command.Price, command.CategoryId, command.StockQuantity);
        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price.Value,
            CategoryId = product.CategoryId,
            StockQuantity = product.StockQuantity.Value
        };

        _mockCategoryRepository.Setup(x => x.GetByIdAsync(command.CategoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        _mockProductRepository.Setup(x => x.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mockMapper.Setup(x => x.Map<ProductDto>(It.IsAny<Product>()))
            .Returns(productDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(command.Name);
        result.Description.Should().Be(command.Description);
        result.Price.Should().Be(command.Price);
        result.CategoryId.Should().Be(command.CategoryId);
        result.StockQuantity.Should().Be(command.StockQuantity);

        _mockCategoryRepository.Verify(x => x.GetByIdAsync(command.CategoryId, It.IsAny<CancellationToken>()), Times.Once);
        _mockProductRepository.Verify(x => x.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockMapper.Verify(x => x.Map<ProductDto>(It.IsAny<Product>()), Times.Once);
    }

    [Fact]
    public async Task Handle_CreateProductCommand_WithInvalidCategory_ShouldThrowException()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            Description = "Test Description",
            Price = 100.50m,
            CategoryId = "invalid-cat",
            StockQuantity = 50
        };

        _mockCategoryRepository.Setup(x => x.GetByIdAsync(command.CategoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        // Act & Assert
        var action = async () => await _handler.Handle(command, CancellationToken.None);
        await action.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Category not found");

        _mockCategoryRepository.Verify(x => x.GetByIdAsync(command.CategoryId, It.IsAny<CancellationToken>()), Times.Once);
        _mockProductRepository.Verify(x => x.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_UpdateProductCommand_WithValidData_ShouldReturnUpdatedProductDto()
    {
        // Arrange
        var command = new UpdateProductCommand
        {
            Id = "prod123",
            Name = "Updated Product",
            Description = "Updated Description",
            Price = 150.75m,
            CategoryId = "cat123"
        };

        var category = Category.Create("Electronics", "Electronic products");
        var product = Product.Create("Original Product", "Original Description", 100m, "cat123", 25);
        var updatedProductDto = new ProductDto
        {
            Id = command.Id,
            Name = command.Name,
            Description = command.Description,
            Price = command.Price,
            CategoryId = command.CategoryId,
            StockQuantity = 25
        };

        _mockProductRepository.Setup(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mockCategoryRepository.Setup(x => x.GetByIdAsync(command.CategoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        _mockProductRepository.Setup(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mockMapper.Setup(x => x.Map<ProductDto>(It.IsAny<Product>()))
            .Returns(updatedProductDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(command.Name);
        result.Description.Should().Be(command.Description);
        result.Price.Should().Be(command.Price);

        _mockProductRepository.Verify(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()), Times.Once);
        _mockCategoryRepository.Verify(x => x.GetByIdAsync(command.CategoryId, It.IsAny<CancellationToken>()), Times.Once);
        _mockProductRepository.Verify(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_UpdateProductCommand_WithInvalidProduct_ShouldThrowException()
    {
        // Arrange
        var command = new UpdateProductCommand
        {
            Id = "invalid-prod",
            Name = "Updated Product",
            Description = "Updated Description",
            Price = 150.75m,
            CategoryId = "cat123"
        };

        _mockProductRepository.Setup(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        // Act & Assert
        var action = async () => await _handler.Handle(command, CancellationToken.None);
        await action.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Product not found");

        _mockProductRepository.Verify(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()), Times.Once);
        _mockProductRepository.Verify(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_UpdateProductStockCommand_WithValidData_ShouldReturnUpdatedProductDto()
    {
        // Arrange
        var command = new UpdateProductStockCommand
        {
            Id = "prod123",
            StockQuantity = 100
        };

        var product = Product.Create("Test Product", "Description", 50m, "cat123", 25);
        var updatedProductDto = new ProductDto
        {
            Id = command.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price.Value,
            CategoryId = product.CategoryId,
            StockQuantity = command.StockQuantity
        };

        _mockProductRepository.Setup(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mockProductRepository.Setup(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mockMapper.Setup(x => x.Map<ProductDto>(It.IsAny<Product>()))
            .Returns(updatedProductDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.StockQuantity.Should().Be(command.StockQuantity);

        _mockProductRepository.Verify(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()), Times.Once);
        _mockProductRepository.Verify(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_DeleteProductCommand_WithValidId_ShouldReturnTrue()
    {
        // Arrange
        var command = new DeleteProductCommand { Id = "prod123" };
        var product = Product.Create("Test Product", "Description", 50m, "cat123", 25);

        _mockProductRepository.Setup(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mockProductRepository.Setup(x => x.DeleteAsync(command.Id, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeTrue();

        _mockProductRepository.Verify(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()), Times.Once);
        _mockProductRepository.Verify(x => x.DeleteAsync(command.Id, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_DeleteProductCommand_WithInvalidId_ShouldThrowException()
    {
        // Arrange
        var command = new DeleteProductCommand { Id = "invalid-prod" };

        _mockProductRepository.Setup(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        // Act & Assert
        var action = async () => await _handler.Handle(command, CancellationToken.None);
        await action.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Product not found");

        _mockProductRepository.Verify(x => x.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()), Times.Once);
        _mockProductRepository.Verify(x => x.DeleteAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
