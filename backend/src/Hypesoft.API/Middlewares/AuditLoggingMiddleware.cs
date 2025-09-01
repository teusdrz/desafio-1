using System.Security.Claims;
using System.Text;

namespace Hypesoft.API.Middlewares;

public class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLoggingMiddleware> _logger;
    private readonly HashSet<string> _sensitiveHeaders = new(StringComparer.OrdinalIgnoreCase)
    {
        "Authorization", "Cookie", "X-API-Key"
    };

    public AuditLoggingMiddleware(RequestDelegate next, ILogger<AuditLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var startTime = DateTime.UtcNow;
        var requestId = context.Items["CorrelationId"]?.ToString() ?? Guid.NewGuid().ToString();

        // Log request
        await LogRequestAsync(context, requestId, startTime);

        // Capture response
        var originalBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        try
        {
            await _next(context);
        }
        finally
        {
            // Log response
            var endTime = DateTime.UtcNow;
            var duration = endTime - startTime;
            await LogResponseAsync(context, requestId, startTime, endTime, duration);

            // Copy response back to original stream
            responseBody.Seek(0, SeekOrigin.Begin);
            await responseBody.CopyToAsync(originalBodyStream);
        }
    }

    private async Task LogRequestAsync(HttpContext context, string requestId, DateTime startTime)
    {
        var request = context.Request;
        var user = context.User;

        var requestInfo = new
        {
            RequestId = requestId,
            Timestamp = startTime,
            Method = request.Method,
            Path = request.Path.Value,
            QueryString = request.QueryString.Value,
            UserAgent = request.Headers.UserAgent.ToString(),
            RemoteIpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            UserName = user.FindFirst(ClaimTypes.Name)?.Value ?? user.FindFirst("preferred_username")?.Value,
            UserEmail = user.FindFirst(ClaimTypes.Email)?.Value,
            Headers = GetSafeHeaders(request.Headers),
            ContentType = request.ContentType,
            ContentLength = request.ContentLength
        };

        if (ShouldLogRequestBody(request))
        {
            request.EnableBuffering();
            var body = await ReadRequestBodyAsync(request);
            _logger.LogInformation("AUDIT REQUEST: {@RequestInfo} Body: {RequestBody}",
                requestInfo, body);
        }
        else
        {
            _logger.LogInformation("AUDIT REQUEST: {@RequestInfo}",
                requestInfo);
        }
    }

    private async Task LogResponseAsync(HttpContext context, string requestId, DateTime startTime, DateTime endTime, TimeSpan duration)
    {
        var response = context.Response;
        var user = context.User;

        var responseInfo = new
        {
            RequestId = requestId,
            StartTime = startTime,
            EndTime = endTime,
            Duration = duration.TotalMilliseconds,
            StatusCode = response.StatusCode,
            ContentType = response.ContentType,
            ContentLength = response.ContentLength,
            UserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            UserName = user.FindFirst(ClaimTypes.Name)?.Value ?? user.FindFirst("preferred_username")?.Value,
            Success = response.StatusCode >= 200 && response.StatusCode < 400
        };

        if (ShouldLogResponseBody(response))
        {
            var body = await ReadResponseBodyAsync(context.Response);
            _logger.LogInformation("AUDIT RESPONSE: {@ResponseInfo} Body: {ResponseBody}",
                responseInfo, body);
        }
        else
        {
            if (responseInfo.Success)
            {
                _logger.LogInformation("AUDIT RESPONSE: {@ResponseInfo}", responseInfo);
            }
            else
            {
                _logger.LogWarning("AUDIT RESPONSE ERROR: {@ResponseInfo}", responseInfo);
            }
        }
    }

    private Dictionary<string, string> GetSafeHeaders(IHeaderDictionary headers)
    {
        return headers
            .Where(h => !_sensitiveHeaders.Contains(h.Key))
            .ToDictionary(h => h.Key, h => h.Value.ToString());
    }

    private static bool ShouldLogRequestBody(HttpRequest request)
    {
        if (request.ContentLength == null || request.ContentLength == 0)
            return false;

        if (request.ContentLength > 10000) // Don't log large bodies
            return false;

        var contentType = request.ContentType?.ToLowerInvariant();
        return contentType != null && (
            contentType.Contains("application/json") ||
            contentType.Contains("application/xml") ||
            contentType.Contains("text/"));
    }

    private static bool ShouldLogResponseBody(HttpResponse response)
    {
        if (response.ContentLength == null || response.ContentLength == 0)
            return false;

        if (response.ContentLength > 10000) // Don't log large bodies
            return false;

        if (response.StatusCode >= 400) // Log error responses
            return true;

        var contentType = response.ContentType?.ToLowerInvariant();
        return contentType != null && (
            contentType.Contains("application/json") ||
            contentType.Contains("application/xml") ||
            contentType.Contains("text/"));
    }

    private static async Task<string> ReadRequestBodyAsync(HttpRequest request)
    {
        request.Body.Position = 0;
        using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
        var body = await reader.ReadToEndAsync();
        request.Body.Position = 0;
        return body;
    }

    private static async Task<string> ReadResponseBodyAsync(HttpResponse response)
    {
        response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(response.Body, Encoding.UTF8, leaveOpen: true);
        var body = await reader.ReadToEndAsync();
        response.Body.Seek(0, SeekOrigin.Begin);
        return body;
    }
}
