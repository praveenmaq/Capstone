using Ecomm_Backend.DTOs.Auth;
using Ecomm_Backend.Models;

namespace Ecomm_Backend.Interfaces
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDTO dto);
        Task<string> Login(LoginDTO dto);
         
        Task<User?> GetUserById(String id);
    }

}
