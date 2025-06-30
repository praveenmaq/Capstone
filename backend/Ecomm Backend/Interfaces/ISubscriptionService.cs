using Ecomm_Backend.DTOs.Subscription;

public interface ISubscriptionService
{
    Task<SubscriptionResponseDto> SubscribeAsync(int userId, SubscribeDto dto);
    Task<bool> CancelSubscriptionAsync(int userId);
    Task<SubscriptionResponseDto> GetSubscriptionAsync(int userId);
    // Task RenewSubscriptionsAsync();
}
