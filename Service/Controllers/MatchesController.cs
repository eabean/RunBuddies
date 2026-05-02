using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RunBuddies.Service;
using System.Security.Claims;

namespace RunBuddies.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MatchesController(IMatchService matchService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMatches()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await matchService.GetMatches(userId);
        return Ok(result);
    }
}
