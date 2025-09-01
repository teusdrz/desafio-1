using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Hypesoft.API.Filters;

/// <summary>
/// Global exception filter that handles all unhandled exceptions in the application.
/// Provides consistent error responses and comprehensive logging for debugging and monitoring.
/// </summary>
public class GlobalExceptionFilter : IExceptionFilter
{
    private readonly ILogger<GlobalExceptionFilter> _logger;
    private readonly IWebHostEnvironment _environment;

    /// <summary>
    /// Initializes a new instance of the <see cref="GlobalExceptionFilter"/> class.
    /// </summary>
    /// <param name="logger">The logger.</param>
    /// <param name="environment">The web host environment.</param>
    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger, IWebHostEnvironment environment)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _environment = environment ?? throw new ArgumentNullException(nameof(environment));
    }

    /// <summary>
    /// Called when an exception occurs during action execution.
    /// </summary>
    /// <param name="context">The exception context.</param>
    public void OnException(ExceptionContext context)
    {
        var exception = context.Exception;
        var request = context.HttpContext.Request;
        var correlationId = context.HttpContext.TraceIdentifier;

        // Log the exception with correlation ID for tracing
        _logger.LogError(exception,
            "Unhandled exception occurred. CorrelationId: {CorrelationId}, Method: {Method}, Path: {Path}, Query: {Query}",
            correlationId, request.Method, request.Path, request.QueryString);

        // Create appropriate error response based on exception type
        var errorResponse = CreateErrorResponse(exception, correlationId);
        var statusCode = GetStatusCode(exception);

        context.Result = new ObjectResult(errorResponse)
        {
            StatusCode = statusCode
        };

        // Add security headers
        context.HttpContext.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        context.HttpContext.Response.Headers.Add("X-Frame-Options", "DENY");
        context.HttpContext.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Creates an appropriate error response based on the exception type and environment.
    /// </summary>
    /// <param name="exception">The exception that occurred.</param>
    /// <param name="correlationId">The correlation ID for tracing.</param>
    /// <returns>An error response object.</returns>
    private object CreateErrorResponse(Exception exception, string correlationId)
    {
        var baseResponse = new
        {
            error = GetErrorType(exception),
            message = GetUserFriendlyMessage(exception),
            correlationId,
            timestamp = DateTime.UtcNow
        };

        // In development, include additional debugging information
        if (_environment.IsDevelopment())
        {
            return new
            {
                baseResponse.error,
                baseResponse.message,
                baseResponse.correlationId,
                baseResponse.timestamp,
                details = exception.Message,
                stackTrace = exception.StackTrace,
                innerException = exception.InnerException?.Message
            };
        }

        return baseResponse;
    }

    /// <summary>
    /// Determines the appropriate HTTP status code based on the exception type.
    /// </summary>
    /// <param name="exception">The exception that occurred.</param>
    /// <returns>The appropriate HTTP status code.</returns>
    private static int GetStatusCode(Exception exception)
    {
        return exception switch
        {
            ArgumentException or ArgumentNullException => 400, // Bad Request
            UnauthorizedAccessException => 401, // Unauthorized
            KeyNotFoundException => 404, // Not Found
            InvalidOperationException => 409, // Conflict
            NotSupportedException => 422, // Unprocessable Entity
            TimeoutException => 408, // Request Timeout
            _ => 500 // Internal Server Error
        };
    }

    /// <summary>
    /// Gets a categorized error type for the exception.
    /// </summary>
    /// <param name="exception">The exception that occurred.</param>
    /// <returns>A string representing the error category.</returns>
    private static string GetErrorType(Exception exception)
    {
        return exception switch
        {
            ArgumentException or ArgumentNullException => "VALIDATION_ERROR",
            UnauthorizedAccessException => "AUTHORIZATION_ERROR",
            KeyNotFoundException => "RESOURCE_NOT_FOUND",
            InvalidOperationException => "BUSINESS_LOGIC_ERROR",
            NotSupportedException => "OPERATION_NOT_SUPPORTED",
            TimeoutException => "TIMEOUT_ERROR",
            JsonException => "SERIALIZATION_ERROR",
            _ => "INTERNAL_ERROR"
        };
    }

    /// <summary>
    /// Gets a user-friendly error message that's safe to expose to clients.
    /// </summary>
    /// <param name="exception">The exception that occurred.</param>
    /// <returns>A user-friendly error message.</returns>
    private static string GetUserFriendlyMessage(Exception exception)
    {
        if (exception is ArgumentException)
            return "The request contains invalid parameters.";
        
        if (exception is ArgumentNullException)
            return "Required information is missing from the request.";
        
        if (exception is UnauthorizedAccessException)
            return "You are not authorized to perform this operation.";
        
        if (exception is KeyNotFoundException)
            return "The requested resource was not found.";
        
        if (exception is InvalidOperationException)
            return "The requested operation cannot be completed at this time.";
        
        if (exception is NotSupportedException)
            return "The requested operation is not supported.";
        
        if (exception is TimeoutException)
            return "The request timed out. Please try again later.";
        
        return "An unexpected error occurred. Please try again later.";
    }
}
