using System.ComponentModel.DataAnnotations;

namespace TailorTechAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Uid { get; set; } = string.Empty; // Firebase UID

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? DisplayName { get; set; }

        public string? PhotoURL { get; set; }

        public bool IsBlocked { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }
    }
}

