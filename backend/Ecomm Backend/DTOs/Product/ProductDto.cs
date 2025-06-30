namespace Ecomm_Backend.DTOs.Product
{
    public class ProductDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public decimal Price { get; set; }
        public required string ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public required string Brand { get; set; }
        public int StockQuantity { get; set; }
    }

    public class ProductCategoryDto
    {
        public required string CategoryName { get; set; }
        public required string ImageUrl { get; set; }
    }

    public class ReviewDto
    {
        public int Rating { get; set; }
        public required string Comment { get; set; }
    }

    public class SearchQueryDto
    {
        public string? query { get; set; }
        public int? minPrice { get; set; }
        public int? maxPrice { get; set; }
        public int? categoryId { get; set; }
        public int sort { get; set; } = 0;
    }

}
