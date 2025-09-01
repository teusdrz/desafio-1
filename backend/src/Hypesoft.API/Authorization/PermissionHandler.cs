using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Hypesoft.API.Authorization;

public class PermissionRequirement : IAuthorizationRequirement
{
    public string Permission { get; }

    public PermissionRequirement(string permission)
    {
        Permission = permission;
    }
}

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var user = context.User;

        // Check if user has the specific permission
        if (user.HasClaim("permissions", requirement.Permission))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Check role-based permissions
        var hasPermission = requirement.Permission switch
        {
            Permissions.ProductCreate => HasProductManagementAccess(user),
            Permissions.ProductUpdate => HasProductManagementAccess(user),
            Permissions.ProductDelete => HasAdminOrManagerAccess(user),
            Permissions.CategoryCreate => HasCategoryManagementAccess(user),
            Permissions.CategoryUpdate => HasCategoryManagementAccess(user),
            Permissions.CategoryDelete => HasAdminOrManagerAccess(user),
            Permissions.StockUpdate => HasStockManagementAccess(user),
            Permissions.ReportView => HasReportingAccess(user),
            Permissions.ReportExport => HasAdminOrManagerAccess(user),
            _ => HasReadAccess(user)
        };

        if (hasPermission)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }

    private static bool HasAdminOrManagerAccess(ClaimsPrincipal user)
    {
        return user.IsInRole(Roles.Admin) || user.IsInRole(Roles.Manager);
    }

    private static bool HasProductManagementAccess(ClaimsPrincipal user)
    {
        return user.IsInRole(Roles.Admin) ||
               user.IsInRole(Roles.Manager) ||
               user.IsInRole(Roles.ProductManager);
    }

    private static bool HasCategoryManagementAccess(ClaimsPrincipal user)
    {
        return user.IsInRole(Roles.Admin) ||
               user.IsInRole(Roles.Manager);
    }

    private static bool HasStockManagementAccess(ClaimsPrincipal user)
    {
        return user.IsInRole(Roles.Admin) ||
               user.IsInRole(Roles.Manager) ||
               user.IsInRole(Roles.StockManager);
    }

    private static bool HasReportingAccess(ClaimsPrincipal user)
    {
        return user.IsInRole(Roles.Admin) ||
               user.IsInRole(Roles.Manager) ||
               user.IsInRole(Roles.Reporter);
    }

    private static bool HasReadAccess(ClaimsPrincipal user)
    {
        return user.IsInRole(Roles.Admin) ||
               user.IsInRole(Roles.Manager) ||
               user.IsInRole(Roles.User) ||
               user.IsInRole(Roles.ProductManager) ||
               user.IsInRole(Roles.StockManager) ||
               user.IsInRole(Roles.Reporter);
    }
}
