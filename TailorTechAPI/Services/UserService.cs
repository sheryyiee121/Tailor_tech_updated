using Microsoft.EntityFrameworkCore;
using TailorTechAPI.Data;
using TailorTechAPI.Models;

namespace TailorTechAPI.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByUidAsync(string uid)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Uid == uid);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateOrUpdateUserAsync(User user)
        {
            try
            {
                var existingUser = await GetUserByUidAsync(user.Uid);

                if (existingUser != null)
                {
                    // Update existing user
                    existingUser.Email = user.Email;
                    existingUser.DisplayName = user.DisplayName;
                    existingUser.PhotoURL = user.PhotoURL;
                    existingUser.LastLoginAt = DateTime.UtcNow;

                    _context.Users.Update(existingUser);
                    await _context.SaveChangesAsync();
                    return existingUser;
                }
                else
                {
                    // Create new user
                    user.CreatedAt = DateTime.UtcNow;
                    user.LastLoginAt = DateTime.UtcNow;

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                    return user;
                }
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("UNIQUE constraint") == true)
            {
                // Handle duplicate - try to find and update
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Uid == user.Uid || u.Email == user.Email);
                if (existingUser != null)
                {
                    existingUser.Email = user.Email;
                    existingUser.DisplayName = user.DisplayName;
                    existingUser.PhotoURL = user.PhotoURL;
                    existingUser.LastLoginAt = DateTime.UtcNow;
                    
                    _context.Users.Update(existingUser);
                    await _context.SaveChangesAsync();
                    return existingUser;
                }
                throw; // Re-throw if we can't handle it
            }
        }

        public async Task<bool> BlockUserAsync(int id, bool isBlocked)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;

            user.IsBlocked = isBlocked;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetTotalUsersCountAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<int> GetBlockedUsersCountAsync()
        {
            return await _context.Users.CountAsync(u => u.IsBlocked);
        }
    }
}

