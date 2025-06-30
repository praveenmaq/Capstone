using Ecomm_Backend.DTOs.CartItem;

namespace Ecomm_Backend.Interfaces
{
    public interface ICartService
    {
        Task<List<CartItemResponseDto>> GetCartAsync(int userId);
        Task AddToCartAsync(int userId, AddToCartDto dto);
        Task RemoveFromCartAsync(int userId, int productId);
        Task UpdateQuantityAsync(int userId, int productId, int quantity);
        Task ClearCartAsync(int userId);
    }
}
