using Microsoft.AspNetCore.Mvc;
using RunBuddies.DTOs.Auth;
using RunBuddies.Exceptions;
using RunBuddies.Service;

namespace RunBuddies.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        try
        {
            var result = await _authService.Register(request);
            return result;
        }
        catch (AuthorizationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        try
        {
            var result = await _authService.Login(request);
            return result;
        }
        catch (AuthorizationException ex)
        {
            return Unauthorized(ex.Message);
        }

    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken(LoginRequest request)
    {
        try
        {
            var result = await _authService.Refresh(request);
            return result;
        }
        catch (AuthorizationException ex)
        {
            return Unauthorized(ex.Message);
        }

    }
}
