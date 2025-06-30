using Ecomm_Backend.Data;
using Ecomm_Backend.Interfaces;
using Ecomm_Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
// Initializes the application builder
var builder = WebApplication.CreateBuilder(args);

// Enables controller-based endpoints, Adds support for Swagger/OpenAPI documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Registers a background task (TrendingRefreshService) that runs periodically (every 24 hours )
builder.Services.AddHostedService<TrendingRefreshService>();

// JWT Authentication/Configuration setup
var configuration = builder.Configuration;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("thisIsASecureKeyWithAtLeast32Characters12345")
            ),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Add EF Core
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

// Registers an image upload service, Singleton means one instance is shared across the app's lifetime
builder.Services.AddSingleton<CloudinaryService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddMemoryCache();

var app = builder.Build();

// Middleware pipeline
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{

}

app.UseHttpsRedirection();

app.UseAuthentication(); // Required for [Authorize] attributes
app.UseAuthorization();  // Checks user roles, policies, etc.

app.MapControllers();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    SeedData.Initialize(context);
}

app.Run();

public class TrendingRefreshService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public TrendingRefreshService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var productService = scope.ServiceProvider.GetRequiredService<IProductService>();
                // await productService.RefreshTrendingProductsAsync();
            }
            // Wait 24 hours
            // await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
