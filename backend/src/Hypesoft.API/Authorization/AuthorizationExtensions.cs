using Microsoft.AspNetCore.Authorization;

namespace Hypesoft.API.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class PermissionAttribute : AuthorizeAttribute
{
    public PermissionAttribute(string permission) : base(permission)
    {
        Policy = permission;
    }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class RequireRoleAttribute : AuthorizeAttribute
{
    public RequireRoleAttribute(string role) : base()
    {
        Roles = role;
    }

    public RequireRoleAttribute(params string[] roles) : base()
    {
        Roles = string.Join(",", roles);
    }
}

public static class AuthorizationPolicyExtensions
{
    public static IServiceCollection AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            // Role-based policies
            options.AddPolicy(Policies.RequireAdminRole, policy =>
                policy.RequireRole(Roles.Admin));

            options.AddPolicy(Policies.RequireManagerRole, policy =>
                policy.RequireRole(Roles.Manager));

            options.AddPolicy(Policies.RequireProductManagement, policy =>
                policy.RequireRole(Roles.Admin, Roles.Manager, Roles.ProductManager));

            options.AddPolicy(Policies.RequireStockManagement, policy =>
                policy.RequireRole(Roles.Admin, Roles.Manager, Roles.StockManager));

            options.AddPolicy(Policies.RequireCategoryManagement, policy =>
                policy.RequireRole(Roles.Admin, Roles.Manager));

            options.AddPolicy(Policies.RequireReporting, policy =>
                policy.RequireRole(Roles.Admin, Roles.Manager, Roles.Reporter));

            // Generic user access policy
            options.AddPolicy("RequireUserAccess", policy =>
                policy.RequireRole(Roles.Admin, Roles.Manager, Roles.User,
                                  Roles.ProductManager, Roles.StockManager, Roles.Reporter));            // Permission-based policies
            options.AddPolicy(Permissions.ProductCreate, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.ProductCreate)));

            options.AddPolicy(Permissions.ProductRead, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.ProductRead)));

            options.AddPolicy(Permissions.ProductUpdate, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.ProductUpdate)));

            options.AddPolicy(Permissions.ProductDelete, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.ProductDelete)));

            options.AddPolicy(Permissions.CategoryCreate, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.CategoryCreate)));

            options.AddPolicy(Permissions.CategoryRead, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.CategoryRead)));

            options.AddPolicy(Permissions.CategoryUpdate, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.CategoryUpdate)));

            options.AddPolicy(Permissions.CategoryDelete, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.CategoryDelete)));

            options.AddPolicy(Permissions.StockUpdate, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.StockUpdate)));

            options.AddPolicy(Permissions.ReportView, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.ReportView)));

            options.AddPolicy(Permissions.ReportExport, policy =>
                policy.Requirements.Add(new PermissionRequirement(Permissions.ReportExport)));
        });

        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

        return services;
    }
}
