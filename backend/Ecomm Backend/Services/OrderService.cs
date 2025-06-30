using CloudinaryDotNet.Actions;
using Ecomm_Backend.Data;
using Ecomm_Backend.DTOs.Order;
using Ecomm_Backend.Models;
using Microsoft.EntityFrameworkCore;

public class OrderService : IOrderService
{
    private readonly DataContext _context;

    // Injects the database context so the service can perform CRUD operations on orders, users, cart, and products
    public OrderService(DataContext context)
    {
        _context = context;
    }

    // This method retrieves orders. It behaves differently for:
    // Admin: gets all user orders
    // Normal/Premium User: gets only their own orders
    public async Task<List<OrderResponseDto>> GetOrdersAsync(int userId, String role)
    {
        if (role == "Admin")
        {
            return await _context.Orders
            .Include(o => o.User) // loads The user who placed the order
            .Include(o => o.Items) // loads The order items
                .ThenInclude(oi => oi.Product) //Each item's product info
            .OrderByDescending(o => o.OrderDate)
            // Projects each entity to a simplified response model with:
            // Order + User info
            .Select(o => new OrderResponseDto
            {
                UserId = o.UserId,
                Username = o.User.Username,
                OrderId = o.Id,
                UserEmail = o.User.Email,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                Paymentstatus = o.PaymentStatus,
                Paymentmethod = o.PaymentMethod,
                Address = o.Address,
                Items = o.Items.Select(i => new OrderItemDetailDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            })
            .ToListAsync(); ;
        }
        // Same logic, but filtered so users can only access their own orders.
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderResponseDto
            {
                UserId = o.UserId,
                Username = o.User.Username,
                UserEmail = o.User.Email,
                OrderId = o.Id,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                Paymentstatus = o.PaymentStatus,
                Paymentmethod = o.PaymentMethod,
                Address = o.Address,
                Items = o.Items.Select(i => new OrderItemDetailDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<OrderResponseDto> CreateOrderAsync(int userId, OrderInputDto dto, String role)
    {
        // Fetch cart items for the user
        var cartItems = await _context.CartItems
            .Where(item => item.UserId == userId)
            .Include(item => item.Product)
            .ToListAsync();

        // Check if cart is empty
        if (!cartItems.Any())
            throw new Exception("Cart is empty. Cannot create order.");

        // Extract product IDs from cart items
        var productIds = cartItems.Select(item => item.ProductId).ToList();

        // Fetch products with current prices (in case cart prices are outdated)
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        // Iterates over each cart item to:
        // Check if product exists
        // Check stock
        // Add item to order
        // Calculate total
        var orderItems = new List<OrderItem>();
        decimal total = 0;

        foreach (var cartItem in cartItems)
        {
            if (!products.ContainsKey(cartItem.ProductId))
                throw new Exception($"Product ID {cartItem.ProductId} not found.");

            var product = products[cartItem.ProductId];

            // Check if product is still available and has sufficient stock
            if (product.StockQuantity < cartItem.Quantity)
                throw new Exception($"Insufficient stock for product {product.Name}. Available: {product.StockQuantity}, Requested: {cartItem.Quantity}");

            var unitPrice = product.Price; // Use current product price

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = cartItem.Quantity,
                UnitPrice = unitPrice
            });

            total += unitPrice * cartItem.Quantity;
        }
        // Apply Delivery Charges
        if (role != "Premium")
            total += 10;
        // Create the order
        var order = new Order
        {
            UserId = userId,
            TotalAmount = total,
            Items = orderItems,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Pending,
            PaymentMethod = dto.Paymethod,
            Address = dto.Address

        };

        // Begin transaction to ensure data consistency
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Add order to database
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Reduces stock after order is saved
            foreach (var cartItem in cartItems)
            {
                var product = products[cartItem.ProductId];
                product.StockQuantity -= cartItem.Quantity;
            }

            // Clear user's cart, save changes and commit transaction
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            // rolls back for partial failure
            await transaction.RollbackAsync();
            throw;
        }

        // Return order response
        return new OrderResponseDto
        {
            UserId = userId,
            OrderId = order.Id,
            OrderDate = order.OrderDate,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            Paymentmethod = dto.Paymethod,
            Paymentstatus = PaymentStatus.Pending,
            Address = order.Address,
            Items = order.Items.Select(i => new OrderItemDetailDto
            {
                ProductId = i.ProductId,
                ProductName = products[i.ProductId].Name,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };
    }
}
