using Microsoft.AspNetCore.Mvc;
using TailorTechAPI.Models;
using TailorTechAPI.Services;

namespace TailorTechAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by id: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/users/uid/firebase-uid
        [HttpGet("uid/{uid}")]
        public async Task<ActionResult<User>> GetUserByUid(string uid)
        {
            try
            {
                var user = await _userService.GetUserByUidAsync(uid);
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by uid: {Uid}", uid);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> CreateOrUpdateUser([FromBody] User user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdUser = await _userService.CreateOrUpdateUserAsync(user);
                return Ok(createdUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating/updating user");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/users/5/block
        [HttpPut("{id}/block")]
        public async Task<IActionResult> BlockUser(int id, [FromBody] BlockUserRequest request)
        {
            try
            {
                var result = await _userService.BlockUserAsync(id, request.IsBlocked);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error blocking/unblocking user: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(id);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class BlockUserRequest
    {
        public bool IsBlocked { get; set; }
    }
}

