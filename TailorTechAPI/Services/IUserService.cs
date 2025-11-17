using TailorTechAPI.Models;

namespace TailorTechAPI.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByUidAsync(string uid);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateOrUpdateUserAsync(User user);
        Task<bool> BlockUserAsync(int id, bool isBlocked);
        Task<bool> DeleteUserAsync(int id);
        Task<int> GetTotalUsersCountAsync();
        Task<int> GetBlockedUsersCountAsync();
    }
}

