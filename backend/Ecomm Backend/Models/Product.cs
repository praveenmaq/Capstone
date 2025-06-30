using System.ComponentModel.DataAnnotations;

namespace Ecomm_Backend.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public required string Name { get; set; }

        [MaxLength(500)]
        public required string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public required string ImageUrl { get; set; }

        public int CategoryId { get; set; }

        public required string Brand { get; set; }

        public int StockQuantity { get; set; }

        public double Rating { get; set; } // average rating
        public int TotalRatings { get; set; } // count of ratings

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsFeatured { get; set; }
    }

    public class ProductCategory
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public required string CategoryName { get; set; }

        [Required]
        public required string ImageUrl { get; set; }
    }
}
