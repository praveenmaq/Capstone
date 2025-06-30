using Ecomm_Backend.DTOs.CartItem;
using Ecomm_Backend.Interfaces;
using Ecomm_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var items = await _cartService.GetCartAsync(GetUserId());
        var cartPrice = items.Sum(x=> x.Price * x.Quantity);
        return Ok(
            new
            {
                length = items.Count,
                data = items,
                cartPrice = cartPrice
            });
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        if(dto.Quantity <= 0) return BadRequest(new { message = "Quantity must be greater than 0." });
        await _cartService.AddToCartAsync(GetUserId(), dto);
        return Ok(new { message = "Added to cart" });
    }

    [HttpPut("{productId}")]
    public async Task<IActionResult> UpdateQuantity(int productId, [FromQuery] int quantity)
    {
        await _cartService.UpdateQuantityAsync(GetUserId(), productId, quantity);
        return Ok(new { message = "Quantity updated" });
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> RemoveFromCart(int productId)
    {
        await _cartService.RemoveFromCartAsync(GetUserId(), productId);
        return Ok(new { message = "Removed from cart" });
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        await _cartService.ClearCartAsync(GetUserId());
        return Ok(new { message = "Cart cleared" });
    }
}
