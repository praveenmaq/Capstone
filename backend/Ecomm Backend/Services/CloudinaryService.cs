using CloudinaryDotNet; // Cloudinary SDK to interact with Cloudinary API
using CloudinaryDotNet.Actions; // Actions related to image upload

namespace Ecomm_Backend.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration config)
        {
            var cloudName = config["CloudinarySettings:CloudName"];
            var apiKey = config["CloudinarySettings:ApiKey"];
            var apiSecret = config["CloudinarySettings:ApiSecret"];

            // Creates a Cloudinary Account object using the Cloud Name, API Key, and API Secre
            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            try
            {
                Console.WriteLine($"CloudinaryService: Starting upload for file: {file.FileName}, Size: {file.Length}");

                //  Opens the file stream of the uploaded file
                await using var stream = file.OpenReadStream();
                // Asynchronously reads the file stream, which allows non-blocking operations.
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "product-categories"
                };

                Console.WriteLine("CloudinaryService: Uploading to Cloudinary...");
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    Console.WriteLine($"CloudinaryService: Upload error: {uploadResult.Error.Message}");
                    throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");
                }

                Console.WriteLine($"CloudinaryService: Upload successful, URL: {uploadResult.SecureUrl}");
                return uploadResult.SecureUrl.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CloudinaryService: Exception during upload: {ex.Message}");
                throw;
            }
        }

    }
}
