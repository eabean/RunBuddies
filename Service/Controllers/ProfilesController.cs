using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RunBuddies.DTOs.Profiles;
using RunBuddies.Service;
using System.Security.Claims;

namespace RunBuddies.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfilesController(IProfileService profileService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateProfile(CreateProfileRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await profileService.CreateProfile(userId, request);
        return CreatedAtAction(nameof(GetProfile), result);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await profileService.GetProfile(userId);
        return Ok(result);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await profileService.UpdateProfile(userId, request);
        return Ok(result);
    }
}
