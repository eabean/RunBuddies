using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RunBuddies.Service;
using System.Security.Claims;

namespace RunBuddies.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DiscoveryController(IDiscoveryService discoveryService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProfiles([FromQuery] int page = 1)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await discoveryService.GetProfiles(userId, page);
        return Ok(result);
    }
}
