using System.ComponentModel.DataAnnotations;

namespace TailorTechAPI.Models
{
    public class MannequinSelection
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty; // Firebase UID

        [Required]
        public string Gender { get; set; } = string.Empty; // "male", "female"

        [Required]
        public string Size { get; set; } = string.Empty; // "small", "medium", "large"

        public Dictionary<string, object>? CustomMeasurements { get; set; }

        public string? AssociatedPrompt { get; set; }

        public string? TextureApplied { get; set; }

        public string? FinalImageUrl { get; set; }

        public bool IsCustomMannequin { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

