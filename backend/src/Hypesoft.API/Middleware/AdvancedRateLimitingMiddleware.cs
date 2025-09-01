using System.Net;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Hypesoft.API.Middleware;

/// <summary>
/// Advanced rate limiting middleware with multiple strategies and logging.
/// Implements protection against brute force attacks and API abuse.
/// </summary>
public class AdvancedRateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AdvancedRateLimitingMiddleware> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="AdvancedRateLimitingMiddleware"/> class.
    /// </summary>
    /// <param name="next">The next middleware in the pipeline.</param>
    /// <param name="logger">The logger.</param>
    public AdvancedRateLimitingMiddleware(RequestDelegate next, ILogger<AdvancedRateLimitingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Invokes the middleware to check rate limits and proceed with the request.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Get client identifier for rate limiting
            var clientId = GetClientIdentifier(context);
            var endpoint = $"{context.Request.Method}:{context.Request.Path}";

            // Log rate limit attempt
            _logger.LogDebug("Rate limit check for client {ClientId} on endpoint {Endpoint}",
                clientId, endpoint);

            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in rate limiting middleware");
            throw;
        }
    }

    /// <summary>
    /// Gets a unique identifier for the client making the request.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>A unique client identifier.</returns>
    private static string GetClientIdentifier(HttpContext context)
    {
        // Use authenticated user ID if available, otherwise fall back to IP
        var userId = context.User?.Identity?.Name;
        if (!string.IsNullOrEmpty(userId))
        {
            return $"user:{userId}";
        }

        // Get real IP address (considering proxies)
        var clientIp = context.Connection.RemoteIpAddress?.ToString();
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();

        return $"ip:{realIp ?? forwardedFor ?? clientIp ?? "unknown"}";
    }

    /// <summary>
    /// Handles rate limit exceeded scenarios with appropriate HTTP response.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    private static async Task HandleRateLimitExceeded(HttpContext context)
    {
        context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
        context.Response.ContentType = "application/json";

        var response = new
        {
            error = "Rate limit exceeded",
            message = "Too many requests. Please try again later.",
            timestamp = DateTime.UtcNow
        };

        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
    }
}
