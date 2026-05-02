using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunBuddies.Data;

namespace RunBuddies.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromptsController(RunBuddiesDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPrompts()
    {
        var prompts = await db.Prompts
            .Where(p => p.IsActive)
            .OrderBy(p => p.PromptText)
            .Select(p => new { p.Id, p.PromptText })
            .ToListAsync();

        return Ok(prompts);
    }
}
