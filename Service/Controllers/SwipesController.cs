using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RunBuddies.DTOs.Swipes;
using RunBuddies.Service;
using System.Security.Claims;

namespace RunBuddies.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SwipesController(ISwipeService swipeService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RecordSwipe(SwipeRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await swipeService.RecordSwipe(userId, request);
        return Ok(result);
    }
}
