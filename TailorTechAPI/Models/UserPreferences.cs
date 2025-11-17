using System.ComponentModel.DataAnnotations;

namespace TailorTechAPI.Models
{
    public class UserPreferences
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty; // Firebase UID

        // Favorite styles
        public string? FavoriteDesignTypes { get; set; } // JSON array

        public string? PreferredColors { get; set; } // JSON array

        public string? PreferredFabrics { get; set; } // JSON array

        // Body preferences
        public string? DefaultGender { get; set; }

        public string? DefaultSize { get; set; }

        public Dictionary<string, object>? SavedMeasurements { get; set; }

        // Usage statistics
        public int TotalPromptsGenerated { get; set; } = 0;

        public int TotalOrdersPlaced { get; set; } = 0;

        public DateTime? LastActiveAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}

