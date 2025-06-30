namespace Ecomm_Backend.DTOs.Subscription
{
    public class SubscribeDto
    {
        public required string Tier { get; set; } // e.g., "Premium"
    }

    public class SubscriptionResponseDto
    {
        public string Tier { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }

}
