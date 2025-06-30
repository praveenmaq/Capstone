using Ecomm_Backend.DTOs.Order;
using Ecomm_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // Extracts the userId from the JWT token
    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

    // Extracts both userId and role from the JWT token
    private (int userId, string role) GetUserIdAndRole()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        return (userId, role);
    }

    // If Admin, fetches all users' orders. If normal user, fetches their own orders only
    // This endpoint retrieves all orders for the user, including their ID and role
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var (userId, role) = GetUserIdAndRole();
        var orders = await _orderService.GetOrdersAsync(userId, role);
        return Ok(new
        {
            orders,
            userId,
            role
        });
    }


    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderInputDto dto )
    {
        var (userId, role) = GetUserIdAndRole();
        var order = await _orderService.CreateOrderAsync(GetUserId(),dto,role );
        return Ok(order);
    }
}
