using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace Hypesoft.API.Filters;

public class GlobalExceptionFilter : IExceptionFilter
{
    private readonly ILogger<GlobalExceptionFilter> _logger;

    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        var correlationId = context.HttpContext.Items["CorrelationId"]?.ToString();

        _logger.LogError(context.Exception,
            "An unhandled exception occurred - CorrelationId: {CorrelationId}",
            correlationId);

        var response = new
        {
            Message = "An error occurred while processing your request",
            CorrelationId = correlationId,
            Details = context.Exception.Message
        };

        context.Result = new ObjectResult(response)
        {
            StatusCode = (int)HttpStatusCode.InternalServerError
        };

        context.ExceptionHandled = true;
    }
}
