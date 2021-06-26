using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Roadmap.Services.Images
{
    public interface IImageService
    {
        Task<string> GetImageUriAsync(string name);
        Task<string> UploadImageAsync(IFormFile file, CancellationToken cancellationToken);
        Task<bool> DeleteImageAsync(string name);
    }
}