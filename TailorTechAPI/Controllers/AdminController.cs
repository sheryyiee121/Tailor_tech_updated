using Microsoft.AspNetCore.Mvc;
using TailorTechAPI.Services;

namespace TailorTechAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IOrderService _orderService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            IUserService userService,
            IOrderService orderService,
            ILogger<AdminController> logger)
        {
            _userService = userService;
            _orderService = orderService;
            _logger = logger;
        }

        // GET: api/admin/stats
        [HttpGet("stats")]
        public async Task<ActionResult<AdminStats>> GetAdminStats()
        {
            try
            {
                var stats = new AdminStats
                {
                    TotalUsers = await _userService.GetTotalUsersCountAsync(),
                    BlockedUsers = await _userService.GetBlockedUsersCountAsync(),
                    TotalOrders = await _orderService.GetTotalOrdersCountAsync(),
                    PendingOrders = await _orderService.GetOrdersCountByStatusAsync("pending"),
                    ProcessingOrders = await _orderService.GetOrdersCountByStatusAsync("processing"),
                    CompletedOrders = await _orderService.GetOrdersCountByStatusAsync("completed"),
                    CancelledOrders = await _orderService.GetOrdersCountByStatusAsync("cancelled")
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin stats");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users for admin");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/admin/orders
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all orders for admin");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class AdminStats
    {
        public int TotalUsers { get; set; }
        public int BlockedUsers { get; set; }
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int ProcessingOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }
    }
}

