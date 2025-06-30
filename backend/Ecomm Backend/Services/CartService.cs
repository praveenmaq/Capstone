using Ecomm_Backend.Data;
using Ecomm_Backend.DTOs.CartItem;
using Ecomm_Backend.Interfaces;
using Ecomm_Backend.Models;
using Microsoft.EntityFrameworkCore;

public class CartService : ICartService
{
    private readonly DataContext _context;

    public CartService(DataContext context)
    {
        _context = context;
    }

    // Returns a list of cart items for the given user, including product details
    public async Task<List<CartItemResponseDto>> GetCartAsync(int userId)
    {
        return await _context.CartItems
            .Where(ci => ci.UserId == userId) // Only items for this user
            .Include(ci => ci.Product) // Include product info for each cart item
            .Select(ci => new CartItemResponseDto // Project to DTO (clean response)
            {
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                Price = ci.Product.Price,
                Quantity = ci.Quantity
            }).ToListAsync();
    }

    // Adds a product to the cart or updates the quantity if it already exists.
    public async Task AddToCartAsync(int userId, AddToCartDto dto)
    {

        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == dto.ProductId);
        // Check if the product is already in the user's cart
        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        // If not, add a new cart item.
        else
        {
            _context.CartItems.Add(new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task RemoveFromCartAsync(int userId, int productId)
    {
        // find the matching cart item
        var item = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

        // If it exists, remove it and save changes
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateQuantityAsync(int userId, int productId, int quantity)
    {
        // Locate the item in the cart
        var item = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

        // If found, update the quantity and save
        if (item != null)
        {
            item.Quantity = quantity;
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearCartAsync(int userId)
    {
        // Get all cart items for the user
        var items = _context.CartItems.Where(ci => ci.UserId == userId);
        // Remove them all at once and save
        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
    }
}
