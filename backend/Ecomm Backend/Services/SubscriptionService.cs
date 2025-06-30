using Ecomm_Backend.Data;
using Ecomm_Backend.DTOs.Subscription;
using Ecomm_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

public class SubscriptionService : ISubscriptionService
{
    private readonly DataContext _context;
    // private readonly INotificationService _notificationService;

    public SubscriptionService(DataContext context)
    {
        _context = context;
        // _notificationService = notificationService;
    }

    public async Task<SubscriptionResponseDto> SubscribeAsync(int userId, SubscribeDto dto)
    {
        // Fetches all subscriptions for this user and checks if any are active
        var existing = (await _context.Subscriptions
            .Where(s => s.UserId == userId)
            .ToListAsync())
            .FirstOrDefault(s => s.IsActive);


        //  If already subscribed, throw error
        if (existing != null)
            throw new Exception("User already has an active subscription");

        // creates a 1-month subscription and adds it to the DB context
        var subscription = new Subscription
        {
            UserId = userId,
            Tier = dto.Tier,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddMonths(1)
        };
        _context.Subscriptions.Add(subscription);

        // Update user’s role
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.Role = dto.Tier;
        }

        // saving all the changes to the database
        await _context.SaveChangesAsync();

        return new SubscriptionResponseDto
        {
            Tier = subscription.Tier,
            StartDate = subscription.StartDate,
            EndDate = subscription.EndDate,
            IsActive = true
        };
    }

    // Cancels the active subscription of a user
    public async Task<bool> CancelSubscriptionAsync(int userId)
    {
        // Gets all subscriptions and filters for the one that’s active
        var sub = (await _context.Subscriptions
            .Where(s => s.UserId == userId)
            .ToListAsync())
            .FirstOrDefault(s => s.IsActive);

        // If no active subscription, return false
        if (sub == null) return false;

        // Mark subscription as ended
        sub.EndDate = DateTime.UtcNow;
        var user = await _context.Users.FindAsync(userId);
        // Reset user role
        if (user != null) user.Role = "Normal";

        // Save and return success
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<SubscriptionResponseDto> GetSubscriptionAsync(int userId)
    {
        // Get latest subscription by start date
        var sub = await _context.Subscriptions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.StartDate)
            .FirstOrDefaultAsync();

        // If no subscription found, return null
        if (sub == null) return null;

        // Return subscription details
        return new SubscriptionResponseDto
        {
            Tier = sub.Tier,
            StartDate = sub.StartDate,
            EndDate = sub.EndDate,
            IsActive = sub.IsActive
        };
    }
}
