using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hypesoft.API.Services;
using System.Security.Claims;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TestController : ControllerBase
{
    private readonly ISignalRNotificationService _signalRService;
    private readonly ILogger<TestController> _logger;

    public TestController(
        ISignalRNotificationService signalRService,
        ILogger<TestController> logger)
    {
        _signalRService = signalRService;
        _logger = logger;
    }

    /// <summary>
    /// Test GraphQL endpoint connectivity
    /// </summary>
    [HttpGet("graphql-info")]
    [AllowAnonymous]
    public IActionResult GetGraphQLInfo()
    {
        return Ok(new
        {
            message = "GraphQL is available at /graphql",
            playground = "Navigate to /graphql in browser for GraphQL Playground",
            endpoints = new
            {
                queries = new[]
                {
                    "products",
                    "product(id: \"guid\")",
                    "categories",
                    "category(id: \"guid\")",
                    "searchProducts(searchTerm: \"term\")",
                    "searchCategories(searchTerm: \"term\")"
                },
                mutations = new[]
                {
                    "createProduct(input: { ... })",
                    "updateProduct(input: { ... })",
                    "deleteProduct(id: \"guid\")",
                    "createCategory(input: { ... })",
                    "updateCategory(input: { ... })",
                    "deleteCategory(id: \"guid\")"
                },
                subscriptions = new[]
                {
                    "onProductCreated",
                    "onProductUpdated",
                    "onProductDeleted",
                    "onCategoryCreated",
                    "onCategoryUpdated",
                    "onCategoryDeleted",
                    "onStockChanged"
                }
            }
        });
    }

    /// <summary>
    /// Test SignalR endpoint connectivity
    /// </summary>
    [HttpGet("signalr-info")]
    [AllowAnonymous]
    public IActionResult GetSignalRInfo()
    {
        return Ok(new
        {
            message = "SignalR is available at /hubs/notifications",
            hubUrl = "/hubs/notifications",
            authentication = "Bearer token required",
            clientMethods = new[]
            {
                "ReceiveNotification",
                "ProductCreated",
                "ProductUpdated",
                "ProductDeleted",
                "CategoryCreated",
                "CategoryUpdated",
                "CategoryDeleted",
                "StockChanged",
                "ReceiveMessage",
                "UserJoinedRoom",
                "UserLeftRoom",
                "UserTyping",
                "OnlineUsersCount"
            },
            serverMethods = new[]
            {
                "JoinRoom(roomName)",
                "LeaveRoom(roomName)",
                "SendMessageToRoom(roomName, message)",
                "SendTypingIndicator(roomName, isTyping)",
                "GetOnlineUsersCount(roomName)"
            }
        });
    }

    /// <summary>
    /// Send test notification to current user
    /// </summary>
    [HttpPost("test-notification")]
    public async Task<IActionResult> SendTestNotification([FromBody] TestNotificationRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User not authenticated");
            }

            await _signalRService.SendNotificationToUser(
                userId,
                request.Title ?? "Test Notification",
                request.Message ?? "This is a test notification from the API",
                new { testData = true, timestamp = DateTime.UtcNow });

            _logger.LogInformation("Test notification sent to user {UserId}", userId);

            return Ok(new
            {
                message = "Test notification sent successfully",
                userId,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending test notification");
            return StatusCode(500, "Error sending notification");
        }
    }

    /// <summary>
    /// Send broadcast notification to all users
    /// </summary>
    [HttpPost("broadcast-notification")]
    public async Task<IActionResult> SendBroadcastNotification([FromBody] TestNotificationRequest request)
    {
        try
        {
            await _signalRService.SendNotificationToAll(
                request.Title ?? "Broadcast Test",
                request.Message ?? "This is a broadcast test notification",
                new { broadcastTest = true, timestamp = DateTime.UtcNow });

            _logger.LogInformation("Broadcast test notification sent");

            return Ok(new
            {
                message = "Broadcast notification sent successfully",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending broadcast notification");
            return StatusCode(500, "Error sending broadcast notification");
        }
    }

    /// <summary>
    /// Test product creation notification
    /// </summary>
    [HttpPost("test-product-notification")]
    public async Task<IActionResult> TestProductNotification()
    {
        try
        {
            var testProduct = new
            {
                Id = Guid.NewGuid(),
                Name = "Test Product",
                Description = "A test product for SignalR testing",
                Price = 99.99m,
                StockQuantity = 10,
                CreatedAt = DateTime.UtcNow
            };

            await _signalRService.NotifyProductCreated(testProduct);

            _logger.LogInformation("Test product creation notification sent");

            return Ok(new
            {
                message = "Product creation notification sent successfully",
                product = testProduct,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending product creation notification");
            return StatusCode(500, "Error sending product notification");
        }
    }

    /// <summary>
    /// Get current connection status
    /// </summary>
    [HttpGet("connection-status")]
    public IActionResult GetConnectionStatus()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = User.FindFirst(ClaimTypes.Name)?.Value;

        return Ok(new
        {
            isAuthenticated = User.Identity?.IsAuthenticated ?? false,
            userId,
            userName,
            timestamp = DateTime.UtcNow,
            services = new
            {
                graphql = "Available at /graphql",
                signalr = "Available at /hubs/notifications",
                swagger = "Available at /swagger"
            }
        });
    }
}

public class TestNotificationRequest
{
    public string? Title { get; set; }
    public string? Message { get; set; }
}
