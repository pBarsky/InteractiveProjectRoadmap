using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using Roadmap.Services.Images;
using Xunit;

namespace Roadmap.Services.Tests
{
    public class ImagesServiceTests
    {
        private readonly IImageService _imageService;
        private readonly Mock<BlobServiceClient> _blobServiceClient;
        private readonly Mock<BlobContainerClient> _blobContainerClient;
        private readonly IConfiguration _config;

        public ImagesServiceTests()
        {
            var appSettings = new Dictionary<string, string>
            {
                {"BlobStorage:ContainerName", "backgrounds"},
                {"BlobStorage:MaxFileSize", "625000"},
                {"BlobStorage:AllowedExtensions", ".tif .tiff .bmp .jpg .jpeg .gif .png .webp"},
                {"BlobStorage:AllowedContentTypes", "image/tiff image/bmp image/jpeg image/gif image/png image/webp"}
            };
            _config = new ConfigurationBuilder().AddInMemoryCollection(appSettings).Build();
            _blobServiceClient = new Mock<BlobServiceClient>();
            _blobContainerClient = new Mock<BlobContainerClient>();
            _blobServiceClient.Setup(x => x.GetBlobContainerClient(It.IsAny<string>()))
                .Returns(() => _blobContainerClient.Object);
            _imageService = new ImageService(_config, _blobServiceClient.Object);
        }


        [Fact]
        public async void GetImageUriAsync_ReturnsNull_WhenImageDoesntExist()
        {
            // Arrange
            var blobClient = new Mock<BlobClient>();
            blobClient.Setup(x => x.ExistsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(Response.FromValue<bool>(false, It.IsAny<Response>()));
            _blobContainerClient.Setup(x => x.GetBlobClient(It.IsAny<string>())).Returns(blobClient.Object);

            // Act
            var uri = await _imageService.GetImageUriAsync(It.IsAny<string>());

            // Assert
            uri.Should().BeNullOrEmpty();
        }

        [Fact]
        public async void GetImageUriAsync_ReturnsUri_WhenImageExists()
        {
            // Arrange
            const string testUri = "http://localhost:3000";
            var blobClient = new Mock<BlobClient>();
            blobClient.Setup(x => x.ExistsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(Response.FromValue<bool>(true, It.IsAny<Response>()));
            blobClient.Setup(x => x.Uri).Returns(new Uri(testUri));
            _blobContainerClient.Setup(x => x.GetBlobClient(It.IsAny<string>())).Returns(blobClient.Object);

            // Act
            var uri = await _imageService.GetImageUriAsync("Cokolwiek");

            // Assert
            uri.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void UploadImageAsync_Null_FileIsNotValid()
        {
            // Arrange
            var file = new Mock<IFormFile>();
            file.Setup(x => x.Length).Returns(0);

            // Act
            var fileName = await _imageService.UploadImageAsync(file.Object, CancellationToken.None);

            // Assert
            fileName.Should().BeNullOrEmpty();
        }

        [Fact]
        public async void UploadImageAsync_Null_CouldNotSaveImageToStorage()
        {
            // Arrange
            var file = new Mock<IFormFile>();
            file.Setup(x => x.Length).Returns(100);
            file.Setup(x => x.ContentType).Returns(_config["BlobStorage:AllowedContentTypes"].Split(' ')[0]);
            file.Setup(x => x.FileName).Returns($"a{_config["BlobStorage:AllowedExtensions"].Split(' ')[0]}");
            var blobClient = new Mock<BlobClient>();
            blobClient.Setup(x => x.UploadAsync(It.IsAny<Stream>(), It.IsAny<BlobHttpHeaders>(), null, null, null, null,
                default(StorageTransferOptions), It.IsAny<CancellationToken>())).Throws(new Exception());
            _blobContainerClient.Setup(x => x.GetBlobClient(It.IsAny<string>())).Returns(blobClient.Object);

            // Act
            var fileName = await _imageService.UploadImageAsync(file.Object, CancellationToken.None);

            // Assert
            fileName.Should().BeNullOrEmpty();
        }

        [Fact]
        public async void UploadImageAsync_FileName_OnSuccess()
        {
            // Arrange
            var file = new Mock<IFormFile>();
            file.Setup(x => x.Length).Returns(100);
            file.Setup(x => x.ContentType).Returns(_config["BlobStorage:AllowedContentTypes"].Split(' ')[0]);
            file.Setup(x => x.FileName).Returns($"a{_config["BlobStorage:AllowedExtensions"].Split(' ')[0]}");
            var blobClient = new Mock<BlobClient>();
            _blobContainerClient.Setup(x => x.GetBlobClient(It.IsAny<string>())).Returns(blobClient.Object);

            // Act
            var fileName = await _imageService.UploadImageAsync(file.Object, CancellationToken.None);

            // Assert
            fileName.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void DeleteImageAsync_False_FileNotExists()
        {
            // Arrange
            var blobClient = new Mock<BlobClient>();
            _blobContainerClient.Setup(x => x.GetBlobClient(It.IsAny<string>())).Returns(blobClient.Object);
            blobClient.Setup(x => x.DeleteIfExistsAsync(DeleteSnapshotsOption.None, null, default))
                .ReturnsAsync(Response.FromValue<bool>(false, It.IsAny<Response>()));

            // Act
            var hasDeleted = await _imageService.DeleteImageAsync("");

            // Assert
            hasDeleted.Should().Be(false);
        }

        [Fact]
        public async void DeleteImageAsync_False_CouldNotDelete()
        {
            // Arrange
            var blobClient = new Mock<BlobClient>();
            _blobContainerClient.Setup(x => x.GetBlobClient(It.IsAny<string>())).Returns(blobClient.Object);
            blobClient.Setup(x => x.DeleteIfExistsAsync(DeleteSnapshotsOption.None, null, default)).Throws(new Exception());

            // Act
            var hasDeleted = await _imageService.DeleteImageAsync("");

            // Assert
            hasDeleted.Should().Be(false);
        }

        [Fact]
        public async void DeleteImageAsync_True_OnSuccess()
        {
            // Arrange
            var blobClient = new Mock<BlobClient>();
            _blobContainerClient.Setup(x => x.GetBlobClient(It.IsAny<string>())).Returns(blobClient.Object);
            blobClient.Setup(x => x.DeleteIfExistsAsync(DeleteSnapshotsOption.None, null, default))
                .ReturnsAsync(Response.FromValue<bool>(true, It.IsAny<Response>()));

            // Act
            var hasDeleted = await _imageService.DeleteImageAsync("");

            // Assert
            hasDeleted.Should().Be(true);
        }
    }
}