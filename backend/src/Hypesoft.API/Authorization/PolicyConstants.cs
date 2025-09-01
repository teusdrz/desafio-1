using Microsoft.AspNetCore.Authorization;

namespace Hypesoft.API.Authorization;

public static class Policies
{
    public const string RequireAdminRole = "RequireAdminRole";
    public const string RequireManagerRole = "RequireManagerRole";
    public const string RequireUserRole = "RequireUserRole";
    public const string RequireProductManagement = "RequireProductManagement";
    public const string RequireCategoryManagement = "RequireCategoryManagement";
    public const string RequireStockManagement = "RequireStockManagement";
    public const string RequireReporting = "RequireReporting";
}

public static class Roles
{
    public const string Admin = "admin";
    public const string Manager = "manager";
    public const string User = "user";
    public const string ProductManager = "product_manager";
    public const string StockManager = "stock_manager";
    public const string Reporter = "reporter";
}

public static class Permissions
{
    public const string ProductCreate = "product:create";
    public const string ProductRead = "product:read";
    public const string ProductUpdate = "product:update";
    public const string ProductDelete = "product:delete";

    public const string CategoryCreate = "category:create";
    public const string CategoryRead = "category:read";
    public const string CategoryUpdate = "category:update";
    public const string CategoryDelete = "category:delete";

    public const string StockUpdate = "stock:update";
    public const string StockRead = "stock:read";

    public const string ReportView = "report:view";
    public const string ReportExport = "report:export";
}
