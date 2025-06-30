using CloudinaryDotNet.Actions;
using Ecomm_Backend.DTOs.Order;

public interface IOrderService
{
    Task<List<OrderResponseDto>> GetOrdersAsync(int userId, String role = "Normal");
    Task<OrderResponseDto> CreateOrderAsync(int userId , OrderInputDto dto ,String role = "Normal");
}
