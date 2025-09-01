using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/status")]
public class StatusController : ControllerBase
{
    [HttpGet]
    public ActionResult Get()
    {
        return Ok(new { Status = "API is running", Time = DateTime.UtcNow });
    }
}
