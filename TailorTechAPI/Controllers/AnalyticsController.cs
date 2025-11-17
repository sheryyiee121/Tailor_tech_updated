using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TailorTechAPI.Data;

namespace TailorTechAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(AppDbContext context, ILogger<AnalyticsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/analytics/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<object>> GetUserAnalytics(string userId)
        {
            try
            {
                var activities = await _context.UserActivities
                    .Where(a => a.UserId == userId)
                    .ToListAsync();

                var prompts = await _context.PromptHistories
                    .Where(p => p.UserId == userId)
                    .ToListAsync();

                var mannequins = await _context.MannequinSelections
                    .Where(m => m.UserId == userId)
                    .ToListAsync();

                var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .ToListAsync();

                var analytics = new
                {
                    TotalActivities = activities.Count,
                    TotalPrompts = prompts.Count,
                    TotalPromptsUsage = prompts.Sum(p => p.UsageCount),
                    FavoritePrompts = prompts.Count(p => p.IsFavorite),
                    TotalMannequinSelections = mannequins.Count,
                    TotalOrders = orders.Count,
                    TotalSpent = orders.Sum(o => o.TotalAmount),
                    MostUsedPrompt = prompts
                        .OrderByDescending(p => p.UsageCount)
                        .Select(p => new { p.Prompt, p.UsageCount })
                        .FirstOrDefault(),
                    PreferredGender = mannequins
                        .GroupBy(m => m.Gender)
                        .OrderByDescending(g => g.Count())
                        .Select(g => g.Key)
                        .FirstOrDefault(),
                    PreferredSize = mannequins
                        .GroupBy(m => m.Size)
                        .OrderByDescending(g => g.Count())
                        .Select(g => g.Key)
                        .FirstOrDefault(),
                    RecentActivities = activities
                        .OrderByDescending(a => a.CreatedAt)
                        .Take(10)
                        .Select(a => new { a.ActivityType, a.Prompt, a.CreatedAt })
                        .ToList()
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/analytics/admin/overview
        [HttpGet("admin/overview")]
        public async Task<ActionResult<object>> GetAdminAnalytics()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var totalActivities = await _context.UserActivities.CountAsync();
                var totalPrompts = await _context.PromptHistories.CountAsync();
                var totalMannequins = await _context.MannequinSelections.CountAsync();
                var totalOrders = await _context.Orders.CountAsync();

                var topPrompts = await _context.PromptHistories
                    .OrderByDescending(p => p.UsageCount)
                    .Take(10)
                    .Select(p => new { p.Prompt, p.UsageCount })
                    .ToListAsync();

                var genderDistribution = await _context.MannequinSelections
                    .GroupBy(m => m.Gender)
                    .Select(g => new { Gender = g.Key, Count = g.Count() })
                    .ToListAsync();

                var sizeDistribution = await _context.MannequinSelections
                    .GroupBy(m => m.Size)
                    .Select(g => new { Size = g.Key, Count = g.Count() })
                    .ToListAsync();

                var analytics = new
                {
                    TotalUsers = totalUsers,
                    TotalActivities = totalActivities,
                    TotalPrompts = totalPrompts,
                    TotalMannequinSelections = totalMannequins,
                    TotalOrders = totalOrders,
                    TopPrompts = topPrompts,
                    GenderDistribution = genderDistribution,
                    SizeDistribution = sizeDistribution,
                    AveragePromptsPerUser = totalUsers > 0 ? (double)totalPrompts / totalUsers : 0,
                    AverageOrdersPerUser = totalUsers > 0 ? (double)totalOrders / totalUsers : 0
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin analytics");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

