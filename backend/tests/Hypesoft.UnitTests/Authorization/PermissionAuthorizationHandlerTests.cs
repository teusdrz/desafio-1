using Hypesoft.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Xunit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Hypesoft.UnitTests.Authorization;

public class PermissionAuthorizationHandlerTests
{
    private readonly PermissionAuthorizationHandler _handler;
    private readonly DefaultHttpContext _httpContext;

    public PermissionAuthorizationHandlerTests()
    {
        _handler = new PermissionAuthorizationHandler();
        _httpContext = new DefaultHttpContext();
    }

    [Theory]
    [InlineData(Roles.Admin, Permissions.ProductCreate, true)]
    [InlineData(Roles.Manager, Permissions.ProductCreate, true)]
    [InlineData(Roles.ProductManager, Permissions.ProductCreate, true)]
    [InlineData(Roles.User, Permissions.ProductCreate, false)]
    [InlineData(Roles.StockManager, Permissions.ProductCreate, false)]
    public async Task HandleRequirementAsync_ProductCreate_ReturnsExpectedResult(
        string role,
        string permission,
        bool shouldSucceed)
    {
        // Arrange
        var user = CreateUserWithRole(role);
        var context = new AuthorizationHandlerContext(
            new[] { new PermissionRequirement(permission) },
            user,
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.Equal(shouldSucceed, context.HasSucceeded);
    }

    [Theory]
    [InlineData(Roles.Admin, Permissions.ProductDelete, true)]
    [InlineData(Roles.Manager, Permissions.ProductDelete, true)]
    [InlineData(Roles.ProductManager, Permissions.ProductDelete, false)]
    [InlineData(Roles.User, Permissions.ProductDelete, false)]
    public async Task HandleRequirementAsync_ProductDelete_ReturnsExpectedResult(
        string role,
        string permission,
        bool shouldSucceed)
    {
        // Arrange
        var user = CreateUserWithRole(role);
        var context = new AuthorizationHandlerContext(
            new[] { new PermissionRequirement(permission) },
            user,
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.Equal(shouldSucceed, context.HasSucceeded);
    }

    [Theory]
    [InlineData(Roles.Admin, Permissions.StockUpdate, true)]
    [InlineData(Roles.Manager, Permissions.StockUpdate, true)]
    [InlineData(Roles.StockManager, Permissions.StockUpdate, true)]
    [InlineData(Roles.ProductManager, Permissions.StockUpdate, false)]
    [InlineData(Roles.User, Permissions.StockUpdate, false)]
    public async Task HandleRequirementAsync_StockUpdate_ReturnsExpectedResult(
        string role,
        string permission,
        bool shouldSucceed)
    {
        // Arrange
        var user = CreateUserWithRole(role);
        var context = new AuthorizationHandlerContext(
            new[] { new PermissionRequirement(permission) },
            user,
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.Equal(shouldSucceed, context.HasSucceeded);
    }

    [Theory]
    [InlineData(Roles.Admin, Permissions.ReportView, true)]
    [InlineData(Roles.Manager, Permissions.ReportView, true)]
    [InlineData(Roles.Reporter, Permissions.ReportView, true)]
    [InlineData(Roles.ProductManager, Permissions.ReportView, false)]
    [InlineData(Roles.User, Permissions.ReportView, false)]
    public async Task HandleRequirementAsync_ReportView_ReturnsExpectedResult(
        string role,
        string permission,
        bool shouldSucceed)
    {
        // Arrange
        var user = CreateUserWithRole(role);
        var context = new AuthorizationHandlerContext(
            new[] { new PermissionRequirement(permission) },
            user,
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.Equal(shouldSucceed, context.HasSucceeded);
    }

    [Theory]
    [InlineData(Roles.Admin, Permissions.CategoryDelete, true)]
    [InlineData(Roles.Manager, Permissions.CategoryDelete, true)]
    [InlineData(Roles.ProductManager, Permissions.CategoryDelete, false)]
    [InlineData(Roles.User, Permissions.CategoryDelete, false)]
    public async Task HandleRequirementAsync_CategoryDelete_ReturnsExpectedResult(
        string role,
        string permission,
        bool shouldSucceed)
    {
        // Arrange
        var user = CreateUserWithRole(role);
        var context = new AuthorizationHandlerContext(
            new[] { new PermissionRequirement(permission) },
            user,
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.Equal(shouldSucceed, context.HasSucceeded);
    }

    [Fact]
    public async Task HandleRequirementAsync_WithSpecificPermissionClaim_Succeeds()
    {
        // Arrange
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "test-user"),
            new Claim("permissions", Permissions.ProductCreate)
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var user = new ClaimsPrincipal(identity);

        var context = new AuthorizationHandlerContext(
            new[] { new PermissionRequirement(Permissions.ProductCreate) },
            user,
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleRequirementAsync_WithoutValidRole_Fails()
    {
        // Arrange
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "test-user")
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var user = new ClaimsPrincipal(identity);

        var context = new AuthorizationHandlerContext(
            new[] { new PermissionRequirement(Permissions.ProductCreate) },
            user,
            null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    private static ClaimsPrincipal CreateUserWithRole(string role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "test-user"),
            new Claim(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, "Test");
        return new ClaimsPrincipal(identity);
    }
}
