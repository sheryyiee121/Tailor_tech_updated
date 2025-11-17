using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TailorTechAPI.Data;
using TailorTechAPI.Models;

namespace TailorTechAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserActivityController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserActivityController> _logger;

        public UserActivityController(AppDbContext context, ILogger<UserActivityController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/useractivity/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserActivity>>> GetUserActivities(string userId)
        {
            try
            {
                var activities = await _context.UserActivities
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();

                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user activities for user: {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/useractivity
        [HttpPost]
        public async Task<ActionResult<UserActivity>> CreateActivity([FromBody] UserActivity activity)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                activity.CreatedAt = DateTime.UtcNow;
                _context.UserActivities.Add(activity);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUserActivities), new { userId = activity.UserId }, activity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user activity");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/useractivity/recent/{userId}?limit=10
        [HttpGet("recent/{userId}")]
        public async Task<ActionResult<IEnumerable<UserActivity>>> GetRecentActivities(string userId, [FromQuery] int limit = 10)
        {
            try
            {
                var activities = await _context.UserActivities
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.CreatedAt)
                    .Take(limit)
                    .ToListAsync();

                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activities");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

