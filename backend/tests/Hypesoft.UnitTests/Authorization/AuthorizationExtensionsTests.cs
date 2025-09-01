using Hypesoft.API.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using Xunit;

namespace Hypesoft.UnitTests.Authorization;

public class AuthorizationExtensionsTests
{
    [Fact]
    public void AddAuthorizationPolicies_RegistersAllPolicies()
    {
        // Arrange
        var services = new ServiceCollection();
        services.AddLogging();

        // Act
        services.AddAuthorizationPolicies();
        var serviceProvider = services.BuildServiceProvider();

        // Assert
        var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();
        Assert.NotNull(authorizationService);

        var authorizationHandler = serviceProvider.GetService<PermissionAuthorizationHandler>();
        Assert.NotNull(authorizationHandler);
    }

    [Fact]
    public void PolicyConstants_ContainsExpectedRoles()
    {
        // Assert
        Assert.Equal("Admin", Roles.Admin);
        Assert.Equal("Manager", Roles.Manager);
        Assert.Equal("User", Roles.User);
        Assert.Equal("ProductManager", Roles.ProductManager);
        Assert.Equal("StockManager", Roles.StockManager);
        Assert.Equal("Reporter", Roles.Reporter);
    }

    [Fact]
    public void PolicyConstants_ContainsExpectedPolicies()
    {
        // Assert
        Assert.Equal("RequireAdminRole", Policies.RequireAdminRole);
        Assert.Equal("RequireManagerRole", Policies.RequireManagerRole);
        Assert.Equal("RequireProductManagement", Policies.RequireProductManagement);
        Assert.Equal("RequireStockManagement", Policies.RequireStockManagement);
        Assert.Equal("RequireCategoryManagement", Policies.RequireCategoryManagement);
        Assert.Equal("RequireReporting", Policies.RequireReporting);
        Assert.Equal("RequireUserAccess", Policies.RequireUserAccess);
    }

    [Fact]
    public void PolicyConstants_ContainsExpectedPermissions()
    {
        // Assert
        Assert.Equal("product:create", Permissions.ProductCreate);
        Assert.Equal("product:read", Permissions.ProductRead);
        Assert.Equal("product:update", Permissions.ProductUpdate);
        Assert.Equal("product:delete", Permissions.ProductDelete);
        Assert.Equal("category:create", Permissions.CategoryCreate);
        Assert.Equal("category:read", Permissions.CategoryRead);
        Assert.Equal("category:update", Permissions.CategoryUpdate);
        Assert.Equal("category:delete", Permissions.CategoryDelete);
        Assert.Equal("stock:update", Permissions.StockUpdate);
        Assert.Equal("report:view", Permissions.ReportView);
        Assert.Equal("report:export", Permissions.ReportExport);
    }
}
