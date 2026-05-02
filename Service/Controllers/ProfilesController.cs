using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RunBuddies.DTOs.Photos;
using RunBuddies.DTOs.Profiles;
using RunBuddies.Service;
using System.Security.Claims;

namespace RunBuddies.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfilesController(IProfileService profileService, IPhotoService photoService) : ControllerBase
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

    [HttpPost("me/prompt-answers")]
    public async Task<IActionResult> SavePromptAnswers(SavePromptAnswersRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await profileService.SavePromptAnswers(userId, request);
        return NoContent();
    }

    [HttpPost("me/photos/upload-url")]
    public async Task<IActionResult> GetPhotoUploadUrl(PhotoUploadUrlRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await photoService.GetUploadUrl(userId, request);
        return Ok(result);
    }

    [HttpPost("me/photos")]
    public async Task<IActionResult> SavePhoto(SavePhotoRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await photoService.SavePhoto(userId, request);
        return Created(string.Empty, result);
    }

    [HttpDelete("me/photos/{photoId:guid}")]
    public async Task<IActionResult> DeletePhoto(Guid photoId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await photoService.DeletePhoto(userId, photoId);
        return NoContent();
    }
}
