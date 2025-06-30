using Ecomm_Backend.DTOs.Product;
using Ecomm_Backend.Models;
using Microsoft.AspNetCore.Mvc;


namespace Ecomm_Backend.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAll();
        Task<IEnumerable<Product>> GetFeaturedDeals();
        Task<IEnumerable<Product>> GetTrendingDeals();
        Task<dynamic?> GetProductById(int id);
        Task<Product> Add(ProductDto product);
        Task<Product> Update(int id, ProductDto product);
        Task<Product> Delete(int id);

        Task<IEnumerable<dynamic>> GetCategories();

        Task<IEnumerable<Product>> SearchProduct(String title, [FromQuery] dynamic filters,
            [FromQuery] int sort = 0);

        Task<IEnumerable<Product>> AddToWishlist(int userId, int productId);

        Task<IEnumerable<Product>> GetWishlist(int userId);
        Task<ProductCategory> AddCategory(ProductCategoryDto dto);
        Task<IEnumerable<Product>> GetProductByCategory(int categoryId);

        Task<Reviews> AddReview(int userId, int productId, int rating, string comment);
        Task<IEnumerable<Reviews>> GetReviews(int productId);

        Task<bool> RemoveFromWishlist(int userId, int productId);
    }
}
