using System.ComponentModel.DataAnnotations;
using Ecomm_Backend.Models;

namespace Ecomm_Backend.DTOs.Order
{
    public class OrderInputDto
    {
        [Required]
        [EnumDataType(typeof(PaymentMethod), ErrorMessage = "Invalid payment method")]
        public PaymentMethod Paymethod { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters")]
        public string Address { get; set; }
    }

    public class OrderResponseDto
    {
        public int OrderId { get; set; }

        public string Username { get; set; }
        public string UserEmail { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public PaymentStatus Paymentstatus { get; set; }

        public PaymentMethod Paymentmethod { get; set; }

        public string Address { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemDetailDto> Items { get; set; }
    }

    public class OrderItemDetailDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public decimal TotalPrice => UnitPrice * Quantity;
    }

}
