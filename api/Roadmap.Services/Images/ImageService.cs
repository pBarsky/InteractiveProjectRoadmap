using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Roadmap.Services.Images
{
    public class ImageService : IImageService
    {
        private readonly string[] _allowedContentTypes;
        private readonly string[] _allowedExtensions;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly BlobServiceClient _blobServiceClient;
        private readonly int _maxFileSize;


        public ImageService(IConfiguration configuration, BlobServiceClient blobServiceClient)
        {
            var storageConfiguration = configuration.GetSection("BlobStorage");
            var containerName = storageConfiguration["ContainerName"];

            _maxFileSize = int.Parse(storageConfiguration["MaxFileSize"]);
            _allowedExtensions = storageConfiguration["AllowedExtensions"].Split(' ');
            _allowedContentTypes = storageConfiguration["AllowedContentTypes"].Split(' ');

            _blobServiceClient = blobServiceClient;
            _blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
            _blobContainerClient.CreateIfNotExists();
            _blobContainerClient.SetAccessPolicy(PublicAccessType.Blob);
        }

        public async Task<string> GetImageUriAsync(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return null;
            }
            var blobClient = _blobContainerClient.GetBlobClient(name);

            var exists = await blobClient.ExistsAsync();
            return !exists.Value ? null : blobClient.Uri.AbsoluteUri;
        }

        public async Task<string> UploadImageAsync(IFormFile file, CancellationToken cancellationToken)
        {
            if (!ValidateFile(file))
            {
                return null;
            }

            var fileExtension = Path.GetExtension(file.FileName);
            var name = $"{Guid.NewGuid()}{fileExtension}";
            var blobClient = _blobContainerClient.GetBlobClient(name);

            try
            {
                await blobClient.UploadAsync(file.OpenReadStream(),
                    new BlobHttpHeaders {ContentType = file.ContentType},
                    cancellationToken: cancellationToken);
            }
            catch
            {
                return null;
            }

            return name;
        }

        public async Task<bool> DeleteImageAsync(string name)
        {
            var blobClient = _blobContainerClient.GetBlobClient(name);
            try
            {
                var deleted = await blobClient.DeleteIfExistsAsync();
                return deleted.Value;
            }
            catch
            {
                return false;
            }
        }

        private bool ValidateFile(IFormFile file)
        {
            if (file == null)
            {
                return false;
            }

            if (file.Length <= 0 || file.Length > _maxFileSize)
            {
                return false;
            }

            if (!_allowedContentTypes.Contains(file.ContentType))
            {
                return false;
            }

            if (!_allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
            {
                return false;
            }

            return true;
        }
    }
}