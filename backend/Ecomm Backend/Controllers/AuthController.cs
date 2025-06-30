using System.Security.Claims;
using Ecomm_Backend.DTOs.Auth;
using Ecomm_Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            try
            {
                var token = await _authService.Register(dto);

                var user = await _authService.GetUserById(dto.Email);

                return Ok(new
                {
                    userToken = token,
                    userDetail = new
                    {
                        email = dto.Email,
                        name = dto.Username,
                        role = user != null ? user.Role : "User"
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            try
            {
                var token = await _authService.Login(dto);
                var user = await _authService.GetUserById(dto.Email);

                return Ok(new
                {
                    userToken = token,
                    userDetail = new
                    {
                        email = dto.Email,
                        name = user != null ? user.Username : "",
                        role = user != null ? user.Role : "User"
                    }
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
        }

        [HttpGet("getUserInfo")]
        public async Task<ActionResult<dynamic>> GetUserInfo()
        {
            var id = GetUserId();
            var user = await _authService.GetUserById(id.ToString());
            return Ok(
                new
                {
                    id = id,
                    name = user.Username,
                    email = user.Email,
                    role = user.Role
                }
                );
        }

    }

}
