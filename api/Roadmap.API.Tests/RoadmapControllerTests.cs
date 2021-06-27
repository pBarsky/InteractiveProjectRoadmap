using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Roadmap.API.Controllers;
using Roadmap.API.DTOs;
using Roadmap.API.Mapper;
using Roadmap.API.Tests.FakeClasses.Builders;
using Roadmap.Domain.Models;
using Roadmap.Services.Images;
using Roadmap.Services.Projects;
using Xunit;

namespace Roadmap.API.Tests
{
    public class RoadmapControllerTests
    {
        private readonly AutoMapper.Mapper _mapper;
        private readonly Mock<IProjectService> _projectService;
        private readonly Mock<IImageService> _imageService;

        public RoadmapControllerTests()
        {
            _projectService = new Mock<IProjectService>();
            _imageService = new Mock<IImageService>();
            _mapper = new AutoMapper.Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new AutoMapperProfile(_imageService.Object))));
        }

        [Fact]
        public async void Get_BadRequestObjectResult_RoadmapNotFound()
        {
            // Arrange
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync((Project)null);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var project = await controller.Get(1);

            // Assert
            project.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Get_OkObjectResultWithProjectDto_RoadmapFound()
        {
            // Arrange
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync(new Project());

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var project = await controller.Get(1);

            // Assert
            project.Result.Should().BeOfType<OkObjectResult>().Which.Value.Should().NotBeNull().And
                .BeOfType<ProjectDto>();
        }

        [Fact]
        public async void GetAll_OkObjectResultWithProjectDtos_RoadmapFound()
        {
            // Arrange
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.GetAllAsync(It.IsAny<AppUser>()))
                .ReturnsAsync(new List<Project> { new Project(), new Project() });

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var project = await controller.Get();

            // Assert
            project.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<IEnumerable<ProjectDto>>().Should()
                .NotBeNull().And.HaveCountGreaterThan(0);
        }

        [Fact]
        public async void Post_BadRequestObjectResult_OnFailure()
        {
            // Arrange
            var returnId = 0;
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<AppUser>())).ReturnsAsync(returnId);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);
            var projectDto = new ProjectDto();

            // Act
            var project = await controller.Post(projectDto);

            // Assert
            project.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Post_CreatedProjectId_OnSuccess()
        {
            // Arrange
            var returnId = 1;
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<AppUser>())).ReturnsAsync(returnId);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);
            var projectDto = new ProjectDto();

            // Act
            var project = await controller.Post(projectDto);

            // Assert
            project.Result.Should().BeOfType<OkObjectResult>().Which.Value.Should().Be(returnId);
        }

        [Fact]
        public async void Delete_BadRequestObjectResult_OnFailure()
        {
            // Arrange
            var id = 1;
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.DeleteAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync(false);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.Delete(id);
            // Assert

            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Delete_OkObjectResult_OnSuccess()
        {
            // Arrange
            var id = 1;
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.DeleteAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync(true);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.Delete(id);
            // Assert

            result.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<bool>().Should().BeTrue();
        }

        [Fact]
        public async void Put_OkObjectResult_OnSuccess()
        {
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.UpdateAsync(It.IsAny<Project>(), It.IsAny<AppUser>())).ReturnsAsync(true);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.Put(It.IsAny<ProjectDto>());
            // Assert

            result.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<bool>().Should().BeTrue();
        }

        [Fact]
        public async void Put_BadRequestObjectResult_OnFailure()
        {
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.UpdateAsync(It.IsAny<Project>(), It.IsAny<AppUser>())).ReturnsAsync(false);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.Put(It.IsAny<ProjectDto>());
            // Assert

            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void AddImage_BadRequestObjectResult_FailedToAddImage()
        {
            // Arrange
            var user = new AppUser { Id = "id" };

            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user)).Build();
            _projectService.Setup(x => x.AddImageAsync(It.IsAny<int>(), It.IsAny<AppUser>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>())).ReturnsAsync((string)null);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.AddImage(It.IsAny<int>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>());

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>().Which.Value.As<string>().Should().BeNullOrEmpty();
        }

        [Fact]
        public async void AddImage_OkObjectResult_SuccessfullyAddedImage()
        {
            // Arrange
            var user = new AppUser { Id = "id" };

            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user)).Build();
            _projectService.Setup(x => x.AddImageAsync(It.IsAny<int>(), It.IsAny<AppUser>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>())).ReturnsAsync("SomeUrl");

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.AddImage(It.IsAny<int>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>());

            // Assert
            result.Should().BeOfType<OkObjectResult>().Which.Value.As<string>().Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void UpdateImage_OkObjectResult_SuccessfullyAddedImage()
        {
            // Arrange
            var user = new AppUser { Id = "id" };

            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user)).Build();
            _projectService.Setup(x => x.UpdateImageAsync(It.IsAny<int>(), It.IsAny<AppUser>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>())).ReturnsAsync("jakiśurl");

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.UpdateImage(It.IsAny<int>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>());

            // Assert
            result.Should().BeOfType<OkObjectResult>().Which.Value.As<string>().Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void UpdateImage_BadRequestObjectResult_()
        {
            // Arrange
            var user = new AppUser { Id = "id" };

            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user)).Build();
            _projectService.Setup(x => x.UpdateImageAsync(It.IsAny<int>(), It.IsAny<AppUser>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>())).ReturnsAsync((string)null);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.UpdateImage(It.IsAny<int>(), It.IsAny<IFormFile>(), It.IsAny<CancellationToken>());

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>().Which.Value.As<string>().Should().BeNullOrEmpty();
        }

        [Fact]
        public async void DeleteImage_OkObjectResult_SuccessfullyAddedImage()
        {
            // Arrange
            var user = new AppUser { Id = "id" };

            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user)).Build();
            _projectService.Setup(x => x.DeleteImageAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync(true);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.DeleteImage(It.IsAny<int>());

            // Assert
            result.Should().BeOfType<OkObjectResult>().Which.Value.As<bool>().Should().BeTrue();
        }

        [Fact]
        public async void DeleteImage_BadRequestObjectResult_()
        {
            // Arrange
            var user = new AppUser { Id = "id" };

            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user)).Build();
            _projectService.Setup(x => x.DeleteImageAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync(false);

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var result = await controller.DeleteImage(It.IsAny<int>());

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>().Which.Value.As<bool>().Should().BeFalse();
        }
    }
}