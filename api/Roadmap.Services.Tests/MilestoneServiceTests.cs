using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using FluentAssertions;
using Moq;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Milestones;
using Xunit;

namespace Roadmap.Services.Tests
{
    public class MilestoneServiceTests
    {
        private readonly Mock<IMilestoneRepository> _milestoneRepository;

        private readonly MilestoneService _milestoneService;
        private readonly Mock<IProjectRepository> _projectRepository;

        public MilestoneServiceTests()
        {
            _milestoneRepository = new Mock<IMilestoneRepository>();
            _projectRepository = new Mock<IProjectRepository>();
            _milestoneService = new MilestoneService(_milestoneRepository.Object, _projectRepository.Object);
        }

        [Fact]
        public async void AddAsync_0_OnFailure()
        {
            // Arrange
            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(0);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(new Project { Id = 1 });
            // Act
            var milestone = new Milestone { ParentProjectId = 1 };
            var result = await _milestoneService.AddAsync(milestone, new AppUser());

            // Assert
            result.Should().Be(0);
        }

        [Fact]
        public async void AddAsync_0_PassedMilestoneIsNull()
        {
            // Arrange
            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);

            // Act
            var result = await _milestoneService.AddAsync(null, new AppUser());

            // Assert
            result.Should().Be(0);
        }

        [Fact]
        public async void AddAsync_CreatedMilestoneId_OnSuccess()
        {
            // Arrange
            const string userId = "1";

            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(new Project { Id = 1, UserId = userId });

            // Act
            var milestone = new Milestone { ParentProjectId = 1 };
            var result = await _milestoneService.AddAsync(milestone,
                new AppUser { Id = userId });

            // Assert
            result.Should().BePositive();
        }

        [Fact]
        public async void GetAllOfProjectAsync_EmptyList_NoMatchesFound()
        {
            // Arrange
            _milestoneRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Milestone, bool>>>()))
                .ReturnsAsync(new List<Milestone>());

            // Act
            var milestones = await _milestoneService.GetAllOfProjectAsync(new Project(), new AppUser());

            // Assert
            milestones.Should().NotBeNull().And.HaveCount(0);
        }

        [Fact]
        public async void GetAllOfProjectAsync_Milestones_MatchesFound()
        {
            // Arrange
            _milestoneRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Milestone, bool>>>()))
                .ReturnsAsync(new List<Milestone> { new Milestone(), new Milestone() });

            // Act
            var milestones = await _milestoneService.GetAllOfProjectAsync(new Project(), new AppUser());

            // Assert
            milestones.Should().NotBeNull().And.HaveCountGreaterThan(0);
        }

        [Fact]
        public async void GetAllOfProjectAsync_Null_ParentProjectIsNull()
        {
            // Arrange
            _milestoneRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Milestone, bool>>>()))
                .ReturnsAsync(new List<Milestone> { new Milestone(), new Milestone() });

            // Act
            var milestones = await _milestoneService.GetAllOfProjectAsync(null, new AppUser());

            // Assert
            milestones.Should().BeNull();
        }

        [Fact]
        public async void GetAsync_Milestone_UserIdMatchesMilestoneOwner()
        {
            // Arrange
            const string userId = "123";
            const int projectId = 1;
            var parentProject = new Project { UserId = userId };
            _milestoneRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(new Milestone { ParentProject = parentProject });
            var user = new AppUser { Id = userId };
            // Act
            var milestone = await _milestoneService.GetAsync(projectId, user);

            // Assert
            milestone.Should().NotBeNull();
        }

        [Fact]
        public async void GetAsync_Null_IdDoesNotMakeSense()
        {
            // Arrange
            const string userId = "123";
            _milestoneRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Milestone)null);
            var user = new AppUser { Id = userId };

            // Act
            var milestone = await _milestoneService.GetAsync(-2, user);

            // Assert
            milestone.Should().BeNull();
        }

        [Fact]
        public async void GetAsync_Null_MilestoneDoesNotExist()
        {
            // Arrange
            const string userId = "123";
            _milestoneRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Milestone)null);
            var user = new AppUser { Id = userId };

            // Act
            var milestone = await _milestoneService.GetAsync(1, user);

            // Assert
            milestone.Should().BeNull();
        }

        [Fact]
        public async void GetAsync_Null_UserIdDoesNotMatchMilestonesParentProjecteOwner()
        {
            // Arrange
            const string userId = "1234";
            const string badUserId = "12312313";
            const int projectId = 1;
            _milestoneRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(new Milestone { ParentProject = new Project { UserId = userId } });
            var user = new AppUser { Id = badUserId };
            // Act
            var milestone = await _milestoneService.GetAsync(projectId, user);

            // Assert
            milestone.Should().BeNull();
        }
    }
}