using Ecomm_Backend.DTOs.Subscription;
using Ecomm_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
// Requires the user to be authenticated via JWT token for all endpoints in this controller
[Authorize]
public class SubscriptionsController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionsController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    // Extracts the userId from the JWT token
    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);


    // this endpoint creates a new subscription mtlb premium 
    [HttpPost]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
    {
        try
        {
            var result = await _subscriptionService.SubscribeAsync(GetUserId(), dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // If there's an active subscription, cancels it and returns 200 OK else error with code 404
    [HttpDelete]
    public async Task<IActionResult> Cancel()
    {
        var success = await _subscriptionService.CancelSubscriptionAsync(GetUserId());
        if (!success) return NotFound(new { error = "No active subscription found" });
        return Ok(new { message = "Subscription cancelled" });
    }

    // Returns 200 OK with subscription details or 404 if user has none
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var sub = await _subscriptionService.GetSubscriptionAsync(GetUserId());
        if (sub == null) return NotFound(new { message = "No subscription found" });
        return Ok(sub);
    }
}
