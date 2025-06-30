using Ecomm_Backend.Data;
using Ecomm_Backend.DTOs.Auth;
using Ecomm_Backend.Interfaces;
using Ecomm_Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Ecomm_Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;

        public AuthService(DataContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // Registers a user and returns a JWT token
        public async Task<string> Register(RegisterDTO dto)
        {
            // Checks if a user already exists with that email
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("User already exists");

            // Generates hashed password and salt
            CreatePasswordHash(dto.Password, out byte[] hash, out byte[] salt);

            // Creates a new User object
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = hash,
                PasswordSalt = salt
            };

            // Saves the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Returns a JWT token for the newly registered user
            return GenerateToken(user);
        }

        // Logs in a user and returns a JWT token
        public async Task<string> Login(LoginDTO dto)
        {
            // Looks for the user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            // Checks if user exists and if password is valid
            if (user == null || !VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
                throw new Exception("Invalid credentials");

            return GenerateToken(user);
        }
        //  Fetches a user either by email or ID
        public async Task<User?> GetUserById(string id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == id || u.Id.ToString() == id);
            return user;
        }

        // Password hashing methods
        private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        // Recalculates the hash using the salt and compares it
        private bool VerifyPasswordHash(string password, byte[] hash, byte[] salt)
        {
            using var hmac = new HMACSHA512(salt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(hash);
        }

        // Generates a JWT token with claims for ID, username, and role
        private string GenerateToken(User user)
        {
            // These claims are embedded in the token and can be used to identify the user in API calls
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };
            // The signing key ensures the token is valid and secure
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            // Creates the token with a 7-day expiry and all the claims
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );
            // Returns the token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
