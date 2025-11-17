using System.ComponentModel.DataAnnotations;

namespace TailorTechAPI.Models
{
    public class UserActivity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty; // Firebase UID

        [Required]
        public string ActivityType { get; set; } = string.Empty; // "prompt_generated", "mannequin_selected", "texture_applied", etc.

        public string? Prompt { get; set; }

        public string? MannequinGender { get; set; } // "male", "female"

        public string? MannequinSize { get; set; } // "small", "medium", "large"

        public string? TextureUrl { get; set; }

        public string? GeneratedImageUrl { get; set; }

        public Dictionary<string, object>? Measurements { get; set; }

        public Dictionary<string, string>? AdditionalData { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

