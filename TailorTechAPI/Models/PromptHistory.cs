using System.ComponentModel.DataAnnotations;

namespace TailorTechAPI.Models
{
    public class PromptHistory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty; // Firebase UID

        [Required]
        public string Prompt { get; set; } = string.Empty;

        public string? GeneratedImageUrl { get; set; }

        public bool IsFavorite { get; set; } = false;

        public string? Tags { get; set; } // Comma-separated tags

        public int UsageCount { get; set; } = 1; // How many times user used this prompt

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastUsedAt { get; set; }
    }
}

