using Hypesoft.Domain.Entities;

namespace Hypesoft.API.GraphQL.Types;

public class ProductType : ObjectType<Product>
{
    protected override void Configure(IObjectTypeDescriptor<Product> descriptor)
    {
        descriptor.Description("Represents a product in the system");

        descriptor
            .Field(p => p.Id)
            .Description("The unique identifier for the product");

        descriptor
            .Field(p => p.Name)
            .Description("The name of the product");

        descriptor
            .Field(p => p.Description)
            .Description("The description of the product");

        descriptor
            .Field(p => p.Price)
            .Description("The price of the product");

        descriptor
            .Field(p => p.StockQuantity)
            .Description("The current stock quantity");

        descriptor
            .Field(p => p.CategoryId)
            .Description("The category identifier");

        descriptor
            .Field(p => p.Category)
            .Description("The category this product belongs to");

        descriptor
            .Field(p => p.CreatedAt)
            .Description("When the product was created");

        descriptor
            .Field(p => p.UpdatedAt)
            .Description("When the product was last updated");
    }
}

public class CategoryType : ObjectType<Category>
{
    protected override void Configure(IObjectTypeDescriptor<Category> descriptor)
    {
        descriptor.Description("Represents a product category");

        descriptor
            .Field(c => c.Id)
            .Description("The unique identifier for the category");

        descriptor
            .Field(c => c.Name)
            .Description("The name of the category");

        descriptor
            .Field(c => c.Description)
            .Description("The description of the category");

        descriptor
            .Field(c => c.Products)
            .Description("The products in this category")
            .UseFiltering()
            .UsePaging();

        descriptor
            .Field(c => c.CreatedAt)
            .Description("When the category was created");

        descriptor
            .Field(c => c.UpdatedAt)
            .Description("When the category was last updated");
    }
}
