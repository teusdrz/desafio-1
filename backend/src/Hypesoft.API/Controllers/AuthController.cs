using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Hypesoft.API.Authorization;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Mock authentication - In production, validate against Keycloak/Identity Provider
        var (isValid, user) = ValidateUser(request.Email, request.Password);
        
        if (!isValid)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var token = GenerateJwtToken(user);
        
        return Ok(new
        {
            token = token,
            user = new
            {
                id = user.Id,
                email = user.Email,
                name = user.Name,
                role = user.Role,
                permissions = GetUserPermissions(user.Role)
            },
            expiresIn = 3600 // 1 hour
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // In production, invalidate token in Redis/cache
        _logger.LogInformation("User {UserId} logged out", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var userName = User.FindFirst(ClaimTypes.Name)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? Roles.User;

        return Ok(new
        {
            id = userId,
            email = userEmail,
            name = userName,
            role = userRole,
            permissions = GetUserPermissions(userRole)
        });
    }

    [HttpPost("refresh")]
    [Authorize]
    public IActionResult RefreshToken()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var userName = User.FindFirst(ClaimTypes.Name)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? Roles.User;

        var user = new MockUser
        {
            Id = userId ?? "mock-user",
            Email = userEmail ?? "user@example.com",
            Name = userName ?? "Mock User",
            Role = userRole
        };

        var token = GenerateJwtToken(user);
        
        return Ok(new
        {
            token = token,
            expiresIn = 3600
        });
    }

    private (bool IsValid, MockUser User) ValidateUser(string email, string password)
    {
        // Mock users for demonstration - In production, validate against your user store
        var mockUsers = new[]
        {
            new MockUser { Id = "admin-1", Email = "admin@hypesoft.com", Name = "Admin User", Role = Roles.Admin, Password = "admin123" },
            new MockUser { Id = "manager-1", Email = "manager@hypesoft.com", Name = "Manager User", Role = Roles.Manager, Password = "manager123" },
            new MockUser { Id = "product-1", Email = "product@hypesoft.com", Name = "Product Manager", Role = Roles.ProductManager, Password = "product123" },
            new MockUser { Id = "stock-1", Email = "stock@hypesoft.com", Name = "Stock Manager", Role = Roles.StockManager, Password = "stock123" },
            new MockUser { Id = "reporter-1", Email = "reporter@hypesoft.com", Name = "Reporter User", Role = Roles.Reporter, Password = "reporter123" },
            new MockUser { Id = "user-1", Email = "user@hypesoft.com", Name = "Regular User", Role = Roles.User, Password = "user123" }
        };

        var user = mockUsers.FirstOrDefault(u => 
            u.Email.Equals(email, StringComparison.OrdinalIgnoreCase) && 
            u.Password == password);

        return (user != null, user ?? new MockUser());
    }

    private string GenerateJwtToken(MockUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"] ?? "your-super-secret-key-that-is-at-least-32-characters-long"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("user_id", user.Id),
            new Claim("permissions", string.Join(",", GetUserPermissions(user.Role)))
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "hypesoft-api",
            audience: _configuration["Jwt:Audience"] ?? "hypesoft-client",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string[] GetUserPermissions(string role)
    {
        return role switch
        {
            Roles.Admin => new[]
            {
                Permissions.ProductCreate, Permissions.ProductRead, Permissions.ProductUpdate, Permissions.ProductDelete,
                Permissions.CategoryCreate, Permissions.CategoryRead, Permissions.CategoryUpdate, Permissions.CategoryDelete,
                Permissions.StockUpdate, Permissions.ReportView, Permissions.ReportExport
            },
            Roles.Manager => new[]
            {
                Permissions.ProductCreate, Permissions.ProductRead, Permissions.ProductUpdate, Permissions.ProductDelete,
                Permissions.CategoryCreate, Permissions.CategoryRead, Permissions.CategoryUpdate, Permissions.CategoryDelete,
                Permissions.StockUpdate, Permissions.ReportView, Permissions.ReportExport
            },
            Roles.ProductManager => new[]
            {
                Permissions.ProductCreate, Permissions.ProductRead, Permissions.ProductUpdate,
                Permissions.CategoryRead
            },
            Roles.StockManager => new[]
            {
                Permissions.ProductRead, Permissions.StockUpdate, Permissions.CategoryRead
            },
            Roles.Reporter => new[]
            {
                Permissions.ProductRead, Permissions.CategoryRead, Permissions.ReportView
            },
            Roles.User => new[]
            {
                Permissions.ProductRead, Permissions.CategoryRead
            },
            _ => new[] { Permissions.ProductRead, Permissions.CategoryRead }
        };
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class MockUser
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
