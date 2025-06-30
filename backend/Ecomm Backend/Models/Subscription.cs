namespace Ecomm_Backend.Models
{
    public class Subscription
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public required string Tier { get; set; } // e.g., Normal, Premium
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive => EndDate == null || EndDate > DateTime.UtcNow;
    }

}
