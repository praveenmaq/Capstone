using Ecomm_Backend.Data;
using Ecomm_Backend.Models;
using Ecomm_Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Ecomm_Backend.DTOs.Product;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Ecomm_Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly DataContext _context;
        private readonly IMemoryCache _cache;

        public ProductService(DataContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        // Retrieves all products from the database
        public async Task<IEnumerable<Product>> GetAll() =>
            await _context.Products.ToListAsync();

        // Returns trending products: top 10 by highest number of ratings (TotalRatings), then by Rating for tie-breaker
        public async Task<IEnumerable<Product>> GetTrendingDeals() =>
            await _context.Products
                .OrderByDescending(p => p.Rating)
                .ThenByDescending(p => p.TotalRatings)
                .Take(10)
                .ToListAsync();
        // public async Task<IEnumerable<Product>> GetFeaturedDeals() =>
        //     await _context.Products.Where(p => p.IsFeatured == true).ToListAsync();

        // Get Featured Deals (With Caching) First checks the cache. If not found: Fetches from DB
        // Stores in cache for 1 minute, Boosts performance by avoiding frequent DB hits.
        public async Task<IEnumerable<Product>> GetFeaturedDeals()
        {
            if (!_cache.TryGetValue("featured_products", out List<Product> featured))
            {
                featured = await _context.Products.Where(p => p.IsFeatured).ToListAsync();
                _cache.Set("featured_products", featured, TimeSpan.FromMinutes(1)); // or your preferred duration
            }
            return featured;
        }

        // Updated SearchProduct to use SearchQueryDto
        // Title search (case-insensitive)
        // Optional filters:
        // categoryId
        // minPrice
        // maxPrice
        // Sorting by price:
        // 0 = no sort
        // 1 = low to high
        // 2 = high to low
        // 3 = rating high-low
        // 4 = rating low-high
        public async Task<IEnumerable<Product>> SearchProduct(
            string title,
            [FromQuery] dynamic filters,
            [FromQuery] int sort = 0)
        {
            var query = _context.Products.AsQueryable();

            // Search by title (case-insensitive)
            if (!string.IsNullOrWhiteSpace(title))
            {
                title = title.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(title));
            }

            // Apply filters (categoryId, minPrice, maxPrice)
            if (filters != null)
            {
                int categoryId = 0;
                decimal? minPrice = null;
                decimal? maxPrice = null;
                try {
                    if (filters.categoryId != null)
                        categoryId = Convert.ToInt32(filters.categoryId);
                    if (filters.minPrice != null)
                        minPrice = Convert.ToDecimal(filters.minPrice);
                    if (filters.maxPrice != null)
                        maxPrice = Convert.ToDecimal(filters.maxPrice);
                } catch { /* ignore conversion errors, treat as null */ }

                if (categoryId > 0)
                {
                    query = query.Where(p => p.CategoryId == categoryId);
                }
                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }
                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }
            }

            // Fetch all filtered products from the database (no sorting in DB)
            var results = await query.ToListAsync();

            // Now sort in memory (C# LINQ to Objects)
            switch (sort)
            {
                case 1:
                    results = results.OrderBy(p => p.Price).ToList();
                    break;
                case 2:
                    results = results.OrderByDescending(p => p.Price).ToList();
                    break;
                case 3:
                    results = results.OrderByDescending(p => p.Rating).ToList();
                    break;
                case 4:
                    results = results.OrderBy(p => p.Rating).ToList();
                    break;
            }

            return results;
        }
        // Product by id - includes category name
        public async Task<dynamic?> GetProductById(int id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.ImageUrl,
                    p.CategoryId,
                    Category = _context.ProductCategories
                        .Where(c => c.Id == p.CategoryId)
                        .Select(c => c.CategoryName)
                        .FirstOrDefault() ?? "Unknown",
                    p.Brand,
                    p.StockQuantity,
                    p.Rating,
                    p.TotalRatings,
                    p.CreatedAt,
                    p.IsFeatured,
                    IsTrending = p.Rating >= 4.0 // Consider products with rating >= 4 as trending
                })
                .FirstOrDefaultAsync();

            return product;
        }

        // Creates a new product using a DTO and adds it to the database.
        public async Task<Product> Add(ProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId,
                Brand = dto.Brand,
                StockQuantity = dto.StockQuantity
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        // update the product
        public async Task<Product> Update(int id, ProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.ImageUrl = dto.ImageUrl;
            product.CategoryId = dto.CategoryId;
            product.Brand = dto.Brand;
            product.StockQuantity = dto.StockQuantity;

            await _context.SaveChangesAsync();
            return product;
        }

        // delegate the product
        public async Task<Product> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return product;
        }

        // Returns all product categories
        public async Task<IEnumerable<dynamic>> GetCategories()
        {
            return await _context.ProductCategories.ToListAsync();
        }

        // Adds a new category to the database.
        public async Task<ProductCategory> AddCategory(ProductCategoryDto dto)
        {
            var category = new ProductCategory
            {
                CategoryName = dto.CategoryName,
                ImageUrl = dto.ImageUrl
            };

            _context.ProductCategories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        // Filters products by their CategoryId
        public async Task<IEnumerable<Product>> GetProductByCategory(int categoryId)
        {
            return await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> AddToWishlist(int userId, int productId)
        {
            // Check if user and product exist
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);

            if (!userExists || product == null)
                return Enumerable.Empty<Product>();

            // Check if already in wishlist
            var alreadyInWishlist = await _context.Wishlist
                .AnyAsync(w => w.UserId == userId && w.ProductId == productId);

            if (!alreadyInWishlist)
            {
                var wishlistItem = new Wishlist
                {
                    UserId = userId,
                    ProductId = productId
                };

                _context.Wishlist.Add(wishlistItem);
                await _context.SaveChangesAsync();
            }

            // Return updated wishlist products for the user
            var wishlistProducts = await _context.Wishlist
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .Select(w => w.Product)
                .ToListAsync();

            return wishlistProducts;
        }

        // Get Wishlist
        public async Task<IEnumerable<Product>> GetWishlist(int userId)
        {
            return await _context.Wishlist
                .Where(u => u.UserId == userId)
                .Select(u => u.Product).ToListAsync();
        }

        public async Task<Reviews> AddReview(int userId, int productId, int rating, string comment)
        {
            var review = new Reviews
            {
                UserId = userId,
                ProductId = productId,
                Rating = rating,
                Comment = comment,
                CreatedAt = DateTime.UtcNow
            };
            _context.Reviews.Add(review);

            // Update product rating and total ratings
            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                // Get all existing reviews for this product
                var existingReviews = await _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .ToListAsync();

                // Calculate new totals including the new review
                var totalReviews = existingReviews.Count + 1; // +1 for the new review
                var totalRatingSum = existingReviews.Sum(r => r.Rating) + rating;

                // Update product
                product.TotalRatings = totalReviews;
                product.Rating = (double)totalRatingSum / totalReviews;

                _context.Products.Update(product);
            }

            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<IEnumerable<Reviews>> GetReviews(int productId)
        {
            return await _context.Reviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        //Remove from Wishlist
        public async Task<bool> RemoveFromWishlist(int userId, int productId)
        {
            var wishlistItem = await _context.Wishlist
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (wishlistItem == null)
                return false;

            _context.Wishlist.Remove(wishlistItem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
