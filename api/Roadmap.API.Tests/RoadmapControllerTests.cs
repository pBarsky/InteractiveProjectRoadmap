using System.Collections.Generic;
using System.Security.Claims;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Roadmap.API.Controllers;
using Roadmap.API.DTOs;
using Roadmap.API.Mapper;
using Roadmap.API.Tests.FakeClasses.Builders;
using Roadmap.Domain.Models;
using Roadmap.Services.Projects;
using Xunit;

namespace Roadmap.API.Tests
{
    public class RoadmapControllerTests
    {
        private readonly AutoMapper.Mapper _mapper;
        private readonly Mock<IProjectService> _projectService;

        public RoadmapControllerTests()
        {
            _projectService = new Mock<IProjectService>();
            _mapper = new AutoMapper.Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new AutoMapperProfile())));
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
            project.Result.Should().BeOfType<OkObjectResult>().Which.Value.Should().NotBeNull().And.BeOfType<ProjectDto>();
        }

        [Fact]
        public async void GetAll_OkObjectResultWithProjectDtos_RoadmapFound()
        {
            // Arrange
            var userManager =
                new FakeUserManagerBuilder().With(s =>
                    s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(new AppUser())).Build();
            _projectService.Setup(x => x.GetAllAsync(It.IsAny<AppUser>())).ReturnsAsync(new List<Project> { new Project(), new Project() });

            var controller = new RoadmapController(userManager.Object, _projectService.Object, _mapper);

            // Act
            var project = await controller.Get();

            // Assert
            project.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<IEnumerable<ProjectDto>>().Should().NotBeNull().And.HaveCountGreaterThan(0);
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
    }
}