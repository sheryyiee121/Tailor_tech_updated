using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TailorTechAPI.Data;
using TailorTechAPI.Models;

namespace TailorTechAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MannequinController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MannequinController> _logger;

        public MannequinController(AppDbContext context, ILogger<MannequinController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/mannequin/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<MannequinSelection>>> GetUserMannequins(string userId)
        {
            try
            {
                var selections = await _context.MannequinSelections
                    .Where(m => m.UserId == userId)
                    .OrderByDescending(m => m.CreatedAt)
                    .ToListAsync();

                return Ok(selections);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting mannequin selections for user: {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/mannequin
        [HttpPost]
        public async Task<ActionResult<MannequinSelection>> CreateSelection([FromBody] MannequinSelection selection)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                selection.CreatedAt = DateTime.UtcNow;
                _context.MannequinSelections.Add(selection);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUserMannequins), new { userId = selection.UserId }, selection);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating mannequin selection");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/mannequin/stats/{userId}
        [HttpGet("stats/{userId}")]
        public async Task<ActionResult<object>> GetUserMannequinStats(string userId)
        {
            try
            {
                var selections = await _context.MannequinSelections
                    .Where(m => m.UserId == userId)
                    .ToListAsync();

                var stats = new
                {
                    TotalSelections = selections.Count,
                    MaleCount = selections.Count(m => m.Gender.ToLower() == "male"),
                    FemaleCount = selections.Count(m => m.Gender.ToLower() == "female"),
                    SmallCount = selections.Count(m => m.Size.ToLower() == "small"),
                    MediumCount = selections.Count(m => m.Size.ToLower() == "medium"),
                    LargeCount = selections.Count(m => m.Size.ToLower() == "large"),
                    CustomMannequinCount = selections.Count(m => m.IsCustomMannequin),
                    MostUsedGender = selections.GroupBy(m => m.Gender)
                        .OrderByDescending(g => g.Count())
                        .Select(g => g.Key)
                        .FirstOrDefault(),
                    MostUsedSize = selections.GroupBy(m => m.Size)
                        .OrderByDescending(g => g.Count())
                        .Select(g => g.Key)
                        .FirstOrDefault()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting mannequin stats");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

