// Import necessary ASP.NET Core and application-specific namespaces
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecomm_Backend.Data;
using Ecomm_Backend.DTOs.Product;
using Ecomm_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Dynamic;
using System.Security.Claims;
using Ecomm_Backend.Interfaces;

// Marks this class as an API controller and sets up routing to "api/products"
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    // Constructor injection of ProductService to handle business logic
    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    // Helper method to extract both user ID and user role from JWT token claims
    private (int userId, string role) GetUserIdAndRole()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value); // Extracts user ID
        var role = User.FindFirst(ClaimTypes.Role)?.Value; // Extracts role (e.g., Admin, Normal)
        return (userId, role);
    }

    // Helper method to extract only the user ID from the JWT claims
    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

    // GET api/products?query=...&sort=...
    // Searches products using query string and sort/filter info from DTO
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] SearchQueryDto dto)
    {
        try
        {
            var results = await _productService.SearchProduct(dto.query, dto, dto.sort);
            if (!results.Any())
            {
                return NotFound("No products match the criteria.");
            }
            return Ok(results);
        }
        catch (Exception ex)
        {
            // Log the error (in real code, use a logger)
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // GET api/products/trending
    // Returns trending products - Only for users who are NOT 'Normal'
    [HttpGet("trending")]
    public async Task<ActionResult<IEnumerable<Product>>> GetTrendingProducts()
    {
        var (userId, role) = GetUserIdAndRole();
        if (role == "Normal") // Block access for Normal users
        {
            return Unauthorized(); // Return 401 Unauthorized
        }

        var results = await _productService.GetTrendingDeals();
        if (!results.Any())
        {
            return NotFound("No products match the criteria.");
        }

        return Ok(results);
    }

    // GET api/products/featured
    // Returns featured products
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Product>>> GetFeaturedProducts()
    {
        var results = await _productService.GetFeaturedDeals();
        if (!results.Any())
        {
            return NotFound("No products match the criteria.");
        }

        return Ok(results);
    }

    // GET api/products/{id}
    // Returns product details by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<dynamic>> GetProduct(int id)
    {
        var product = await _productService.GetProductById(id);
        if (product == null)
            return NotFound(); // If not found, return 404
        return Ok(product); // Return product details
    }

    // POST api/products
    // Adds a new product - Only Admins are authorized
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> AddProduct(ProductDto dto)
    {
        var product = await _productService.Add(dto);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product); // Returns 201 Created
    }

    // PUT api/products/{id}
    // Updates an existing product by ID
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
    {
        var updated = await _productService.Update(id, dto);
        if (updated == null) return NotFound(); // Product not found
        return NoContent(); // Return 204 No Content after successful update
    }

    // DELETE api/products/{id}
    // Deletes product by ID
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _productService.Delete(id);
        if (deleted == null) return NotFound(); // Product not found
        return NoContent(); // Return 204 after successful deletion
    }

    // GET api/products/categories
    // Returns all available product categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetCategories()
    {
        var categories = await _productService.GetCategories();
        return Ok(categories);
    }

    // POST api/products/addcategory
    // Adds a new product category - Admin only
    [HttpPost("addcategory")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductCategory>> AddCategory(ProductCategoryDto dto)
    {
        var category = await _productService.AddCategory(dto);
        return CreatedAtAction(nameof(AddCategory), new { id = category.Id }, category); // Return 201
    }

    // GET api/products/category/{id}
    // Returns products belonging to a specific category
    [HttpGet("category/{id}")]
    public async Task<ActionResult<IEnumerable<Product>>> GetProductByCategory(int id)
    {
        var products = await _productService.GetProductByCategory(id);
        return Ok(products);
    }

    // POST api/products/addToWishlist/{productId}
    // Adds a product to user's wishlist
    [HttpPost("addToWishlist/{productId}")]
    public async Task<ActionResult<IEnumerable<Product>>> AddToWishlist(int productId)
    {
        int userId = GetUserId();
        var wishlist = await _productService.AddToWishlist(userId, productId);
        return Ok(wishlist); // Return updated wishlist
    }

    // GET api/products/wishlist
    // Gets the logged-in user's wishlist
    [HttpGet("wishlist")]
    public async Task<ActionResult<IEnumerable<Product>>> GetWishlist()
    {
        int userId = GetUserId();
        var wishlist = await _productService.GetWishlist(userId);
        return Ok(wishlist);
    }

    // POST api/products/{productId}/reviews
    // Adds a review to a product - Requires authentication
    [HttpPost("{productId}/reviews")]
    [Authorize]
    public async Task<ActionResult<Reviews>> AddReview(int productId, [FromBody] ReviewDto dto)
    {
        var userId = GetUserId();
        var review = await _productService.AddReview(userId, productId, dto.Rating, dto.Comment);
        return Ok(review);
    }

    // GET api/products/{productId}/reviews
    // Gets all reviews for a product
    [HttpGet("{productId}/reviews")]
    public async Task<ActionResult<IEnumerable<Reviews>>> GetReviews(int productId)
    {
        var reviews = await _productService.GetReviews(productId);
        return Ok(reviews);
    }

    // POST api/products/refresh-trending
    // Triggers logic to refresh trending product list - Admin only
    [HttpPost("refresh-trending")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RefreshTrending()
    {
        // await _productService.RefreshTrendingProductsAsync();
        return Ok("Trending products refreshed.");
    }

    // DELETE api/products/removeFromWishlist/{productId}
    // Removes a product from user's wishlist - Requires authentication
    [HttpDelete("removeFromWishlist/{productId}")]
    [Authorize]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        int userId = GetUserId();
        var removed = await _productService.RemoveFromWishlist(userId, productId);
        if (!removed)
            return NotFound(); // Product wasn't in wishlist
        return Ok(new { message = "Removed from wishlist" }); // Confirmation message
    }
}
