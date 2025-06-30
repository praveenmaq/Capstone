using System.ComponentModel.DataAnnotations;
using Ecomm_Backend.DTOs;
using Ecomm_Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadImageController : Controller
    {
        private readonly CloudinaryService _cloundinaryService;
        public UploadImageController(CloudinaryService cloudinaryService)
        {
            _cloundinaryService = cloudinaryService;
        }

        // Maps this method to an HTTP POST request at /api/uploadimage/upload
        [HttpPost("upload")]
        // [Authorize(Roles = "Admin")] // Temporarily commented out for testing
        public async Task<IActionResult> UploadImage([Required][FromForm] FileUploadDto dto)
        {
            try
            {
                Console.WriteLine($"UploadImageController: Received upload request");
                Console.WriteLine($"UploadImageController: File present: {dto.File != null}");

                // Validates that a file was actually uploaded
                if (dto.File == null || dto.File.Length == 0)
                {
                    Console.WriteLine("UploadImageController: No file uploaded or file is empty");
                    return BadRequest("No file uploaded");
                }

                Console.WriteLine($"UploadImageController: File details - Name: {dto.File.FileName}, Size: {dto.File.Length}");

                // Calls the service to upload the file to Cloudinary
                var imageUrl = await _cloundinaryService.UploadImageAsync(dto.File);

                Console.WriteLine($"UploadImageController: Upload successful, returning URL: {imageUrl}");

                // Returns HTTP 200 OK with the image URL in the response body
                return Ok(imageUrl);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UploadImageController: Exception occurred: {ex.Message}");
                Console.WriteLine($"UploadImageController: Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
