using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public ActionResult GetHealth()
    {
        var healthInfo = new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Version = "1.0.0",
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
            MachineName = Environment.MachineName,
            ProcessId = Environment.ProcessId
        };

        _logger.LogInformation("Health check requested: {@HealthInfo}", healthInfo);

        return Ok(healthInfo);
    }

    [HttpGet("ready")]
    [AllowAnonymous]
    public ActionResult GetReadiness()
    {
        // Here you could check database connectivity, external services, etc.
        var readinessInfo = new
        {
            Status = "Ready",
            Timestamp = DateTime.UtcNow,
            Dependencies = new
            {
                Database = "Healthy", // Should check MongoDB connection
                Cache = "Healthy"     // Should check Redis connection
            }
        };

        return Ok(readinessInfo);
    }

    [HttpGet("live")]
    [AllowAnonymous]
    public ActionResult GetLiveness()
    {
        return Ok(new { Status = "Alive", Timestamp = DateTime.UtcNow });
    }
}
