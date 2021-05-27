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
using Roadmap.API.Tests.FakeClasses;
using Roadmap.API.Tests.FakeClasses.Builders;
using Roadmap.Domain.Models;
using Roadmap.Services.Milestones;
using Roadmap.Services.Projects;
using Xunit;

namespace Roadmap.API.Tests
{
    public class MilestonesControllerTests
    {
        private readonly IMapper _mapper;
        private readonly Mock<IMilestoneService> _milestoneService;
        private readonly Mock<IProjectService> _projectService;
        private readonly AppUser _testUser;
        private readonly Mock<FakeUserManager> _userManager;

        public MilestonesControllerTests()
        {
            _testUser = new AppUser {Id = "SomeUserId"};
            _userManager = new FakeUserManagerBuilder().With(s =>
                s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(_testUser)).Build();
            _milestoneService = new Mock<IMilestoneService>();
            _projectService = new Mock<IProjectService>();
            _mapper = new AutoMapper.Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new AutoMapperProfile())));
        }

        [Fact]
        public async void Get_BadRequestObjectResult_MilestoneNotFound()
        {
            // Arrange

            _milestoneService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>()))
                .ReturnsAsync((Milestone) null);

            var controller = new MilestonesController(_milestoneService.Object, _projectService.Object,
                _userManager.Object, _mapper);

            // Act
            var milestone = await controller.Get(1);

            // Assert
            milestone.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Get_OkObjectResultWithMilestoneDto_MilestoneFound()
        {
            // Arrange

            _milestoneService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>()))
                .ReturnsAsync(new Milestone());

            var controller = new MilestonesController(_milestoneService.Object, _projectService.Object,
                _userManager.Object, _mapper);

            // Act
            var milestone = await controller.Get(1);

            // Assert
            milestone.Result.Should().BeOfType<OkObjectResult>().Which.Value.Should().BeOfType<MilestoneDto>();
        }

        [Fact]
        public async void GetAllOfProject_EmptyList_NoMilestonesOfAnProjectFound()
        {
            // Arrange
            var project = new Project {Id = 1, UserId = _testUser.Id};


            _milestoneService.Setup(x => x.GetAllOfProjectAsync(project, _testUser))
                .ReturnsAsync(new List<Milestone>());
            _projectService.Setup(x => x.GetAsync(project.Id, _testUser)).ReturnsAsync(project);

            var controller = new MilestonesController(_milestoneService.Object, _projectService.Object,
                _userManager.Object, _mapper);

            // Act
            var milestones = await controller.GetAllOfProject(project.Id);

            // Assert
            milestones.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<IEnumerable<MilestoneDto>>().Should()
                .HaveCount(0);
        }
        [Fact]
        public async void GetAllOfProject_BadRequest_NoProjectFound()
        {
            // Arrange
            var project = new Project {Id = 1, UserId = _testUser.Id};
            const int wrongId = 2;

            _milestoneService.Setup(x => x.GetAllOfProjectAsync(project, _testUser))
                .ReturnsAsync(new List<Milestone>());
            _projectService.Setup(x => x.GetAsync(project.Id, _testUser)).ReturnsAsync(project);

            var controller = new MilestonesController(_milestoneService.Object, _projectService.Object,
                _userManager.Object, _mapper);

            // Act
            var milestones = await controller.GetAllOfProject(wrongId);

            // Assert
            milestones.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void GetAllOfProject_PopulatedList_MilestonesOfAProjectFound()
        {
            // Arrange
            var project = new Project {Id = 1, UserId = _testUser.Id};


            var testMilestones = new List<Milestone>
                {new Milestone {ParentProjectId = project.Id}, new Milestone {ParentProjectId = project.Id},};
            _milestoneService.Setup(x => x.GetAllOfProjectAsync(project, _testUser)).ReturnsAsync(testMilestones);
            _projectService.Setup(x => x.GetAsync(project.Id, _testUser)).ReturnsAsync(project);

            var controller = new MilestonesController(_milestoneService.Object, _projectService.Object,
                _userManager.Object, _mapper);

            // Act
            var milestones = await controller.GetAllOfProject(project.Id);

            // Assert
            milestones.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<IEnumerable<MilestoneDto>>().Should()
                .HaveCountGreaterThan(0);
        }

        [Fact]
        public async void Post_BadRequestObjectResult_MilestoneDtoIsNull()
        {
            // Arrange
            MilestoneDto milestone = null;

            var controller =
                new MilestonesController(_milestoneService.Object, _projectService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(milestone);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }     
        [Fact]
        public async void Post_UnauthorizedObjectResult_UserWasNotFound()
        {
            // Arrange
            var milestone = new MilestoneDto();
            _userManager.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync((AppUser)null);

            var controller =
                new MilestonesController(_milestoneService.Object, _projectService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(milestone);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
        }

        [Fact]
        public async void Post_BadRequestObjectResult_ProjectDidNotBelongToUserOrCouldNotSaveChanges()
        {
            var milestone = new MilestoneDto();
            _milestoneService.Setup(x => x.AddAsync(It.IsAny<Milestone>(), It.IsAny<AppUser>())).ReturnsAsync(default(int));

            var controller =
                new MilestonesController(_milestoneService.Object, _projectService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(milestone);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Post_OkObjectResultWithIdOfCreatedMilestone_OnSuccess()
        {
            const int milestoneId = 1;
            var milestone = new MilestoneDto();
            _milestoneService.Setup(x => x.AddAsync(It.IsAny<Milestone>(), It.IsAny<AppUser>())).ReturnsAsync(milestoneId);

            var controller =
                new MilestonesController(_milestoneService.Object, _projectService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(milestone);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<int>().Should().Be(milestoneId);
        }
    }
}