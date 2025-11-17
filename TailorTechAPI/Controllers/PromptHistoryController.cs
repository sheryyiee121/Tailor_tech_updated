using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TailorTechAPI.Data;
using TailorTechAPI.Models;

namespace TailorTechAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromptHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PromptHistoryController> _logger;

        public PromptHistoryController(AppDbContext context, ILogger<PromptHistoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/prompthistory/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PromptHistory>>> GetUserPrompts(string userId)
        {
            try
            {
                var prompts = await _context.PromptHistories
                    .Where(p => p.UserId == userId)
                    .OrderByDescending(p => p.LastUsedAt ?? p.CreatedAt)
                    .ToListAsync();

                return Ok(prompts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting prompt history for user: {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/prompthistory
        [HttpPost]
        public async Task<ActionResult<PromptHistory>> CreateOrUpdatePrompt([FromBody] PromptHistory promptHistory)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if prompt already exists for this user
                var existing = await _context.PromptHistories
                    .FirstOrDefaultAsync(p => p.UserId == promptHistory.UserId && p.Prompt == promptHistory.Prompt);

                if (existing != null)
                {
                    // Update existing prompt
                    existing.UsageCount++;
                    existing.LastUsedAt = DateTime.UtcNow;
                    if (!string.IsNullOrEmpty(promptHistory.GeneratedImageUrl))
                    {
                        existing.GeneratedImageUrl = promptHistory.GeneratedImageUrl;
                    }

                    _context.PromptHistories.Update(existing);
                    await _context.SaveChangesAsync();
                    return Ok(existing);
                }
                else
                {
                    // Create new prompt
                    promptHistory.CreatedAt = DateTime.UtcNow;
                    promptHistory.LastUsedAt = DateTime.UtcNow;
                    _context.PromptHistories.Add(promptHistory);
                    await _context.SaveChangesAsync();
                    return CreatedAtAction(nameof(GetUserPrompts), new { userId = promptHistory.UserId }, promptHistory);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating/updating prompt history");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/prompthistory/recent/{userId}?limit=10
        [HttpGet("recent/{userId}")]
        public async Task<ActionResult<IEnumerable<PromptHistory>>> GetRecentPrompts(string userId, [FromQuery] int limit = 10)
        {
            try
            {
                var prompts = await _context.PromptHistories
                    .Where(p => p.UserId == userId)
                    .OrderByDescending(p => p.LastUsedAt ?? p.CreatedAt)
                    .Take(limit)
                    .ToListAsync();

                return Ok(prompts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent prompts");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/prompthistory/{id}/favorite
        [HttpPut("{id}/favorite")]
        public async Task<IActionResult> ToggleFavorite(int id)
        {
            try
            {
                var prompt = await _context.PromptHistories.FindAsync(id);
                if (prompt == null)
                {
                    return NotFound();
                }

                prompt.IsFavorite = !prompt.IsFavorite;
                _context.PromptHistories.Update(prompt);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling favorite");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

