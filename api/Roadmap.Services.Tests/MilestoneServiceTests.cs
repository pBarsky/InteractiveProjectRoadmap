using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using FluentAssertions;
using Moq;
using Roadmap.Domain.Migrations;
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
        public async void AddAsync_0_ConnectedMilestoneDoesntExist()
        {
            // Arrange
            const string userId = "1";
            var milestone = new Milestone { Id = 1, ParentProjectId = 1, ConnectedToId = 2 };
            var notExistingConnectedMilestone = new Milestone { Id = 2 };

            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);
            _milestoneRepository.Setup(x => x.GetAsync(milestone.Id)).ReturnsAsync(new Milestone { Id = 1 });
            _milestoneRepository.Setup(x => x.GetAsync(notExistingConnectedMilestone.Id))
                .ReturnsAsync((Milestone)null);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(new Project { Id = 1, UserId = userId });
            // Act
            var result = await _milestoneService.AddAsync(milestone,
                new AppUser { Id = userId });

            // Assert
            result.Should().Be(0);
        }

        [Fact]
        public async void AddAsync_0_ConnectedMilestoneHandleIsOccupied()
        {
            // Arrange
            const string userId = "1";
            var milestone = new Milestone { Id = 1, ParentProjectId = 1, ConnectedToId = 2, ConnectedToSourceHandleId = HandleId.Left, ConnectedToTargetHandleId = HandleId.Right };
            var connectedMilestone = new Milestone { Id = 2, ParentProjectId = 1, ConnectedToSourceHandleId = HandleId.Left, ConnectedToTargetHandleId = HandleId.Right };

            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);
            _milestoneRepository.Setup(x => x.GetAsync(milestone.Id)).ReturnsAsync(new Milestone { Id = 1 });
            _milestoneRepository.Setup(x => x.GetAsync(connectedMilestone.Id))
                .ReturnsAsync((Milestone)null);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(new Project { Id = 1, UserId = userId });
            // Act
            var result = await _milestoneService.AddAsync(milestone,
                new AppUser { Id = userId });

            // Assert
            result.Should().Be(0);
        }


        [Fact]
        public async void AddAsync_CreatedMilestoneId_OnSuccess()
        {
            // Arrange
            const string userId = "1";

            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(new Project { Id = 1, UserId = userId });

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

        [Fact]
        public async void DeleteAsync_False_IdIsInvalid()
        {
            // Arrange
            const int invalidId = -1;
            var user = It.IsAny<AppUser>();

            // Act
            var result = await _milestoneService.DeleteAsync(invalidId, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void DeleteAsync_False_MilestoneNotFound()
        {
            // Arrange
            const int id = 1;
            var user = It.IsAny<AppUser>();

            // Act
            var result = await _milestoneService.DeleteAsync(id, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void DeleteAsync_False_CouldNotUpdatedMilestonePointingToTarget()
        {
            // Arrange
            const string userId = "1";
            var parentProject = new Project { UserId = userId };
            var milestone = new Milestone { Id = 1, ParentProject = parentProject, ConnectedToId = 2 };
            var milestone2 = new Milestone { Id = 2 };

            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);
            _milestoneRepository.Setup(x => x.GetAsync(milestone.Id)).ReturnsAsync(milestone);
            _milestoneRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Milestone, bool>>>())).ReturnsAsync(new List<Milestone> { milestone2 });
            _milestoneRepository.Setup(x => x.UpdateAsync(It.IsAny<Milestone>())).ReturnsAsync(false);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(parentProject);
            // Act
            var result = await _milestoneService.DeleteAsync(milestone.Id, new AppUser { Id = userId });

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void DeleteAsync_True_UserIsNotOwnerOfMilestonesParentProject()
        {
            // Arrange
            const int milestoneId = 1;
            const string userId = "123";
            var parentProject = new Project { UserId = userId };
            _milestoneRepository
                .Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(new Milestone { Id = milestoneId, ParentProject = parentProject });
            _milestoneRepository.Setup(x => x.DeleteAsync(It.IsAny<int>())).ReturnsAsync(true);
            var user = new AppUser { Id = userId };
            // Act

            var result = await _milestoneService.DeleteAsync(milestoneId, user);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async void UpdateAsync_False_MilestoneNotFound()
        {
            // Arrange
            const int milestoneId = 1;
            var milestone = new Milestone { Id = milestoneId };
            var user = It.IsAny<AppUser>();
            _milestoneRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Milestone)null);

            // Act
            var result = await _milestoneService.UpdateAsync(milestone, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void UpdateAsync_False_ConnectedMilestoneDoesntExist()
        {
            const string userId = "1";
            var parentProject = new Project { UserId = userId };
            var milestone = new Milestone { Id = 1, ParentProject = parentProject, ConnectedToId = 2 };
            var milestone2 = new Milestone { Id = 2 };

            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);
            _milestoneRepository.Setup(x => x.GetAsync(milestone.Id)).ReturnsAsync(milestone);
            _milestoneRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Milestone, bool>>>())).ReturnsAsync(new List<Milestone>());
            _milestoneRepository.Setup(x => x.UpdateAsync(It.IsAny<Milestone>())).ReturnsAsync(false);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(parentProject);
            // Act
            var result = await _milestoneService.UpdateAsync(milestone, new AppUser { Id = userId });

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void UpdateAsync_False_ConnectedMilestoneHandleIsOccupied()
        {
            const string userId = "1";
            var parentProject = new Project { UserId = userId };
            var milestone = new Milestone { Id = 1, ParentProject = parentProject, ConnectedToId = 2, ConnectedToSourceHandleId = HandleId.Left, ConnectedToTargetHandleId = HandleId.Left };
            var milestone2 = new Milestone { Id = 2, ParentProject = parentProject, ConnectedToSourceHandleId = HandleId.Left, ConnectedToTargetHandleId = HandleId.Right };

            _milestoneRepository.Setup(x => x.AddAsync(It.IsAny<Milestone>())).ReturnsAsync(1);
            _milestoneRepository.Setup(x => x.GetAsync(milestone.Id)).ReturnsAsync(milestone);
            _milestoneRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Milestone, bool>>>())).ReturnsAsync(new List<Milestone>() { milestone2 });
            _milestoneRepository.Setup(x => x.UpdateAsync(It.IsAny<Milestone>())).ReturnsAsync(false);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(parentProject);
            // Act
            var result = await _milestoneService.UpdateAsync(milestone, new AppUser { Id = userId });

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void UpdateAsync_True_UserIsNotOwnerOfMilestonesParentProject()
        {
            // Arrange
            const int milestoneId = 1;
            const string userId = "123";
            var user = new AppUser { Id = userId };
            var parentProject = new Project { UserId = userId };
            var milestone = new Milestone { Id = milestoneId };
            _milestoneRepository
                .Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(new Milestone { Id = milestoneId, ParentProject = parentProject });
            _milestoneRepository.Setup(x => x.UpdateAsync(It.IsAny<Milestone>())).ReturnsAsync(true);

            // Act
            var result = await _milestoneService.UpdateAsync(milestone, user);

            // Assert  
            result.Should().BeTrue();
        }
    }
}