using Ecomm_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Ecomm_Backend.Data
{
    public static class SeedData
    {
        public static void Initialize(DataContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Seed Admin Users first (only if no users exist)
            if (!context.Users.Any())
            {
                SeedUsers(context);
            }

            // Check if data already exists for products/categories
            if (context.ProductCategories.Any() || context.Products.Any())
            {
                return; // Database has been seeded
            }

            // Seed Product Categories
            var categories = new ProductCategory[]
            {
                new ProductCategory
                {
                    CategoryName = "Electronics",
                    ImageUrl = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop"
                },
                new ProductCategory
                {
                    CategoryName = "Clothing",
                    ImageUrl = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop"
                },
                new ProductCategory
                {
                    CategoryName = "Home & Garden",
                    ImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
                },
                new ProductCategory
                {
                    CategoryName = "Sports & Outdoors",
                    ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                },
                new ProductCategory
                {
                    CategoryName = "Books",
                    ImageUrl = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
                },
                new ProductCategory
                {
                    CategoryName = "Health & Beauty",
                    ImageUrl = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop"
                }
            };

            context.ProductCategories.AddRange(categories);
            context.SaveChanges();

            // Seed Products
            var products = new Product[]
            {
                // Electronics
                new Product
                {
                    Name = "iPhone 15 Pro",
                    Description = "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
                    Price = 999.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
                    CategoryId = 1,
                    Brand = "Apple",
                    StockQuantity = 50,
                    Rating = 4.8,
                    TotalRatings = 245,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "Samsung Galaxy S24 Ultra",
                    Description = "Premium Android smartphone with S Pen, 200MP camera, and AI features",
                    Price = 1199.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop",
                    CategoryId = 1,
                    Brand = "Samsung",
                    StockQuantity = 35,
                    Rating = 4.7,
                    TotalRatings = 189,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "MacBook Air M3",
                    Description = "Ultra-thin laptop with M3 chip, 18-hour battery life, and stunning Retina display",
                    Price = 1299.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop",
                    CategoryId = 1,
                    Brand = "Apple",
                    StockQuantity = 25,
                    Rating = 4.9,
                    TotalRatings = 312,
                    IsFeatured = false
                },
                new Product
                {
                    Name = "Sony WH-1000XM5 Headphones",
                    Description = "Industry-leading noise canceling wireless headphones with 30-hour battery",
                    Price = 349.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
                    CategoryId = 1,
                    Brand = "Sony",
                    StockQuantity = 75,
                    Rating = 4.6,
                    TotalRatings = 156,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "iPad Pro 12.9\"",
                    Description = "Ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil support",
                    Price = 1099.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
                    CategoryId = 1,
                    Brand = "Apple",
                    StockQuantity = 40,
                    Rating = 4.8,
                    TotalRatings = 203,
                    IsFeatured = false
                },

                // Clothing
                new Product
                {
                    Name = "Nike Air Max 270",
                    Description = "Comfortable running shoes with Max Air unit for all-day comfort",
                    Price = 149.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
                    CategoryId = 2,
                    Brand = "Nike",
                    StockQuantity = 100,
                    Rating = 4.5,
                    TotalRatings = 87,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "Levi's 501 Original Jeans",
                    Description = "Classic straight-leg jeans with authentic fits and premium denim",
                    Price = 89.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop",
                    CategoryId = 2,
                    Brand = "Levi's",
                    StockQuantity = 150,
                    Rating = 4.4,
                    TotalRatings = 234,
                    IsFeatured = false
                },
                new Product
                {
                    Name = "Adidas Ultraboost 22",
                    Description = "Energy-returning running shoes with Boost midsole technology",
                    Price = 179.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
                    CategoryId = 2,
                    Brand = "Adidas",
                    StockQuantity = 80,
                    Rating = 4.7,
                    TotalRatings = 145,
                    IsFeatured = true
                },

                // Home & Garden
                new Product
                {
                    Name = "Dyson V15 Detect",
                    Description = "Powerful cordless vacuum with laser dust detection and LCD screen",
                    Price = 749.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
                    CategoryId = 3,
                    Brand = "Dyson",
                    StockQuantity = 30,
                    Rating = 4.6,
                    TotalRatings = 167,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "Philips Hue Smart Bulbs (4-Pack)",
                    Description = "Color-changing smart LED bulbs controlled via smartphone app",
                    Price = 199.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1567473030492-533b30c5494c?w=500&h=500&fit=crop",
                    CategoryId = 3,
                    Brand = "Philips",
                    StockQuantity = 120,
                    Rating = 4.5,
                    TotalRatings = 89,
                    IsFeatured = false
                },

                // Sports & Outdoors
                new Product
                {
                    Name = "Yeti Rambler 30oz Tumbler",
                    Description = "Insulated stainless steel tumbler that keeps drinks cold or hot for hours",
                    Price = 39.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500&h=500&fit=crop",
                    CategoryId = 4,
                    Brand = "Yeti",
                    StockQuantity = 200,
                    Rating = 4.8,
                    TotalRatings = 312,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "Patagonia Houdini Jacket",
                    Description = "Ultra-lightweight windbreaker perfect for outdoor activities",
                    Price = 129.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=500&h=500&fit=crop",
                    CategoryId = 4,
                    Brand = "Patagonia",
                    StockQuantity = 60,
                    Rating = 4.7,
                    TotalRatings = 98,
                    IsFeatured = false
                },

                // Books
                new Product
                {
                    Name = "The Seven Husbands of Evelyn Hugo",
                    Description = "A captivating novel about a reclusive Hollywood icon's life secrets",
                    Price = 16.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
                    CategoryId = 5,
                    Brand = "St. Martin's Press",
                    StockQuantity = 85,
                    Rating = 4.9,
                    TotalRatings = 1234,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "Atomic Habits",
                    Description = "An easy and proven way to build good habits and break bad ones",
                    Price = 18.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop",
                    CategoryId = 5,
                    Brand = "Avery",
                    StockQuantity = 120,
                    Rating = 4.8,
                    TotalRatings = 567,
                    IsFeatured = false
                },

                // Health & Beauty
                new Product
                {
                    Name = "The Ordinary Niacinamide 10% + Zinc 1%",
                    Description = "High-strength vitamin and mineral blemish formula",
                    Price = 7.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop",
                    CategoryId = 6,
                    Brand = "The Ordinary",
                    StockQuantity = 300,
                    Rating = 4.4,
                    TotalRatings = 456,
                    IsFeatured = true
                },
                new Product
                {
                    Name = "Fitbit Charge 5",
                    Description = "Advanced fitness and health tracker with built-in GPS and stress management",
                    Price = 199.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
                    CategoryId = 6,
                    Brand = "Fitbit",
                    StockQuantity = 75,
                    Rating = 4.3,
                    TotalRatings = 178,
                    IsFeatured = false
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }

        private static void SeedUsers(DataContext context)
        {
            // Check if admin user already exists
            if (context.Users.Any(u => u.Email == "admin@admin.com"))
            {
                return; // Admin user already exists
            }

            // Create password hash for admin user
            CreatePasswordHash("admin123", out byte[] adminHash, out byte[] adminSalt);
            CreatePasswordHash("test123", out byte[] testHash, out byte[] testSalt);

            var users = new User[]
            {
                new User
                {
                    Username = "Admin",
                    Email = "admin@admin.com",
                    PasswordHash = adminHash,
                    PasswordSalt = adminSalt,
                    Role = "Admin"
                },
                new User
                {
                    Username = "Test User",
                    Email = "test@test.com",
                    PasswordHash = testHash,
                    PasswordSalt = testSalt,
                    Role = "Normal"
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
