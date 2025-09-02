using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace Hypesoft.API.Extensions;

/// <summary>
/// Extension methods for configuring Swagger documentation.
/// Provides comprehensive API documentation with security, examples, and advanced features.
/// </summary>
public static class SwaggerExtensions
{
    /// <summary>
    /// Adds comprehensive Swagger configuration to the service collection.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Hypesoft Product Management API",
                Version = "v1",
                Description = @"
**Hypesoft Product Management API** is a comprehensive enterprise-grade solution for managing products, categories, and inventory.

## Features
- **Domain-Driven Design** with proper aggregates and domain events
- **Advanced CQRS** with pagination, filtering, and sorting
- **Comprehensive Security** with JWT authentication and rate limiting
- **Performance Optimization** with Redis caching and query optimization
- **Real-time Notifications** with SignalR integration
- **Enterprise Logging** with structured logging and correlation IDs

## Authentication
This API uses JWT Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer {your-jwt-token}
```

## Rate Limiting
- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 1000 requests per hour
- **Premium users**: 5000 requests per hour

## Pagination
All list endpoints support pagination with the following parameters:
- `pageNumber`: Page number (1-based, default: 1)
- `pageSize`: Items per page (1-100, default: 10)

## Error Handling
The API returns consistent error responses with:
- HTTP status codes
- Error messages
- Correlation IDs for tracking
- Validation details when applicable

## Caching
Responses are cached using Redis for improved performance:
- Product lists: 5 minutes
- Individual products: 15 minutes
- Categories: 30 minutes
",
                Contact = new OpenApiContact
                {
                    Name = "Hypesoft Development Team",
                    Email = "dev@hypesoft.com",
                    Url = new Uri("https://hypesoft.com/contact")
                },
                License = new OpenApiLicense
                {
                    Name = "MIT License",
                    Url = new Uri("https://opensource.org/licenses/MIT")
                },
                TermsOfService = new Uri("https://hypesoft.com/terms")
            });

            // Add JWT Authentication to Swagger
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = @"
JWT Authorization header using the Bearer scheme.
Enter 'Bearer' [space] and then your token in the text input below.
Example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header
                    },
                    new List<string>()
                }
            });

            // Include XML comments for better documentation
            var xmlFiles = new[]
            {
                "Hypesoft.API.xml",
                "Hypesoft.Application.xml",
                "Hypesoft.Domain.xml"
            };

            foreach (var xmlFile in xmlFiles)
            {
                var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
                }
            }

            // Add operation filters for enhanced documentation
            c.OperationFilter<SwaggerDefaultValuesFilter>();
            c.OperationFilter<SwaggerExamplesFilter>();
            c.SchemaFilter<SwaggerEnumSchemaFilter>();

            // Configure Swagger to use camelCase for properties
            c.DescribeAllParametersInCamelCase();

            // Add custom tags for better organization
            c.TagActionsBy(api => new[] { GetControllerName(api) });
            c.DocInclusionPredicate((name, api) => true);

            // Enable annotations for richer documentation
            c.EnableAnnotations();
        });

        return services;
    }

    /// <summary>
    /// Configures Swagger middleware in the application pipeline.
    /// </summary>
    /// <param name="app">The application builder.</param>
    /// <param name="environment">The web host environment.</param>
    /// <returns>The application builder for chaining.</returns>
    public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app, IWebHostEnvironment environment)
    {
        // Enable Swagger in all environments for this demo
        // In production, you might want to restrict this
        app.UseSwagger(c =>
        {
            c.RouteTemplate = "api/docs/{documentName}/swagger.json";
            c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
            {
                swaggerDoc.Servers = new List<OpenApiServer>
                {
                    new OpenApiServer { Url = $"{httpReq.Scheme}://{httpReq.Host.Value}" }
                };
            });
        });

        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/api/docs/v1/swagger.json", "Hypesoft API v1");
            c.RoutePrefix = "api/docs";
            c.DocumentTitle = "Hypesoft Product Management API";

            // Customize the UI
            c.DefaultModelsExpandDepth(-1); // Hide models section by default
            c.DefaultModelRendering(Swashbuckle.AspNetCore.SwaggerUI.ModelRendering.Model);
            c.DisplayRequestDuration();
            c.EnableDeepLinking();
            c.EnableFilter();
            c.EnableValidator();
            c.ShowExtensions();
            c.ShowCommonExtensions();

            // Add custom CSS for better appearance
            c.InjectStylesheet("/swagger-ui/custom.css");

            // Enable OAuth2 if needed
            c.OAuthClientId("swagger-ui");
            c.OAuthAppName("Hypesoft API Swagger UI");
            c.OAuthUseBasicAuthenticationWithAccessCodeGrant();
        });

        return app;
    }

    /// <summary>
    /// Gets the controller name from API description.
    /// </summary>
    /// <param name="api">The API description.</param>
    /// <returns>The controller name.</returns>
    private static string GetControllerName(Microsoft.AspNetCore.Mvc.ApiExplorer.ApiDescription api)
    {
        var controllerName = api.ActionDescriptor.RouteValues["controller"] ?? "Unknown";
        return char.ToUpperInvariant(controllerName[0]) + controllerName.Substring(1);
    }
}

/// <summary>
/// Operation filter to add default values to Swagger documentation.
/// </summary>
public class SwaggerDefaultValuesFilter : IOperationFilter
{
    /// <summary>
    /// Applies default values to operation parameters.
    /// </summary>
    /// <param name="operation">The OpenAPI operation.</param>
    /// <param name="context">The operation filter context.</param>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.Parameters == null)
            return;

        foreach (var parameter in operation.Parameters)
        {
            var description = context.ApiDescription.ParameterDescriptions
                .FirstOrDefault(p => p.Name == parameter.Name);

            if (description?.DefaultValue != null)
            {
                parameter.Schema.Default = new Microsoft.OpenApi.Any.OpenApiString(description.DefaultValue.ToString());
            }
        }
    }
}

/// <summary>
/// Operation filter to add examples to Swagger documentation.
/// </summary>
public class SwaggerExamplesFilter : IOperationFilter
{
    /// <summary>
    /// Applies examples to operation responses.
    /// </summary>
    /// <param name="operation">The OpenAPI operation.</param>
    /// <param name="context">The operation filter context.</param>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Add examples for common response types
        if (operation.Responses.ContainsKey("200"))
        {
            var response = operation.Responses["200"];
            if (response.Content.ContainsKey("application/json"))
            {
                var content = response.Content["application/json"];
                if (context.MethodInfo.ReturnType.Name.Contains("Product"))
                {
                    content.Example = new Microsoft.OpenApi.Any.OpenApiObject
                    {
                        ["id"] = new Microsoft.OpenApi.Any.OpenApiString("550e8400-e29b-41d4-a716-446655440000"),
                        ["name"] = new Microsoft.OpenApi.Any.OpenApiString("Premium Laptop"),
                        ["description"] = new Microsoft.OpenApi.Any.OpenApiString("High-performance laptop for professionals"),
                        ["price"] = new Microsoft.OpenApi.Any.OpenApiDouble(1299.99),
                        ["stockQuantity"] = new Microsoft.OpenApi.Any.OpenApiInteger(25),
                        ["categoryId"] = new Microsoft.OpenApi.Any.OpenApiString("electronics"),
                        ["createdAt"] = new Microsoft.OpenApi.Any.OpenApiString(DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ")),
                        ["updatedAt"] = new Microsoft.OpenApi.Any.OpenApiString(DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"))
                    };
                }
            }
        }
    }
}

/// <summary>
/// Schema filter to enhance enum documentation.
/// </summary>
public class SwaggerEnumSchemaFilter : ISchemaFilter
{
    /// <summary>
    /// Applies enum descriptions to schema.
    /// </summary>
    /// <param name="schema">The OpenAPI schema.</param>
    /// <param name="context">The schema filter context.</param>
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type.IsEnum)
        {
            schema.Description += "<br/>Possible values:<br/>";
            var enumValues = Enum.GetValues(context.Type);
            foreach (var enumValue in enumValues)
            {
                schema.Description += $"• {enumValue} = {(int)enumValue}<br/>";
            }
        }
    }
}
