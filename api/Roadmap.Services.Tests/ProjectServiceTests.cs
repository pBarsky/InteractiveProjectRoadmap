using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Images;
using Roadmap.Services.Projects;
using Xunit;

namespace Roadmap.Services.Tests
{
    public class ProjectServiceTests
    {
        private readonly Mock<IProjectRepository> _projectRepository;
        private readonly Mock<IImageService> _imageService;

        private readonly ProjectService _projectService;

        public ProjectServiceTests()
        {
            _projectRepository = new Mock<IProjectRepository>();
            _imageService = new Mock<IImageService>();
            _projectService = new ProjectService(_projectRepository.Object, _imageService.Object);
        }

        [Fact]
        public async void AddAsync_0_OnFailure()
        {
            // Arrange
            _projectRepository.Setup(x => x.AddAsync(It.IsAny<Project>())).ReturnsAsync(0);

            // Act
            var result = await _projectService.AddAsync(new Project(), new AppUser());

            // Assert
            result.Should().Be(0);
        }

        [Fact]
        public async void AddAsync_0_PassedProjectIsNull()
        {
            // Arrange
            _projectRepository.Setup(x => x.AddAsync(It.IsAny<Project>())).ReturnsAsync(1);

            // Act
            var result = await _projectService.AddAsync(null, new AppUser());

            // Assert
            result.Should().Be(0);
        }

        [Fact]
        public async void AddAsync_CreatedProjectId_OnSuccess()
        {
            // Arrange
            _projectRepository.Setup(x => x.AddAsync(It.IsAny<Project>())).ReturnsAsync(1);

            // Act
            var result = await _projectService.AddAsync(new Project(), new AppUser());

            // Assert
            result.Should().BePositive();
        }

        [Fact]
        public async void GetAllAsync_EmptyList_NoMatchesFound()
        {
            // Arrange
            _projectRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Project, bool>>>()))
                .ReturnsAsync(new List<Project>());
            var user = new AppUser();

            // Act
            var projects = await _projectService.GetAllAsync(user);

            // Assert
            projects.Should().NotBeNull().And.HaveCount(0);
        }

        [Fact]
        public async void GetAllAsync_Projects_MatchesFound()
        {
            // Arrange
            _projectRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Project, bool>>>()))
                .ReturnsAsync(new List<Project>() {new Project(), new Project()});
            var user = new AppUser();

            // Act
            var projects = await _projectService.GetAllAsync(user);

            // Assert
            projects.Should().NotBeNull().And.HaveCountGreaterThan(0);
        }

        [Fact]
        public async void GetAsync_Null_IdDoesNotMakeSense()
        {
            // Arrange
            const string userId = "123";
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Project) null);
            var user = new AppUser {Id = userId};

            // Act
            var project = await _projectService.GetAsync(-2, user);

            // Assert
            project.Should().BeNull();
        }

        [Fact]
        public async void GetAsync_Null_ProjectDoesNotExist()
        {
            // Arrange
            const string userId = "123";
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Project) null);
            var user = new AppUser {Id = userId};

            // Act
            var project = await _projectService.GetAsync(1, user);

            // Assert
            project.Should().BeNull();
        }

        [Fact]
        public async void GetAsync_Null_UserIdDoesNotMatchProjectOwner()
        {
            // Arrange
            const string userId = "123";
            const string badUserId = "12312313";
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(new Project {UserId = userId});
            var user = new AppUser {Id = badUserId};
            // Act
            var project = await _projectService.GetAsync(1, user);

            // Assert
            project.Should().BeNull();
        }

        [Fact]
        public async void GetAsync_Project_UserIdMatchesProjectOwner()
        {
            // Arrange
            const string userId = "123";
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(new Project {UserId = userId});
            var user = new AppUser {Id = userId};
            // Act
            var project = await _projectService.GetAsync(1, user);

            // Assert
            project.Should().NotBeNull();
        }

        [Fact]
        public async void DeleteAsync_False_InvalidId()
        {
            const int invalidId = -1;
            var user = It.IsAny<AppUser>();

            // Act
            var result = await _projectService.DeleteAsync(invalidId, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void DeleteAsync_False_RoadmapNotFound()
        {
            // Arrange
            const int id = 1;
            var user = It.IsAny<AppUser>();

            // Act
            var result = await _projectService.DeleteAsync(id, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void DeleteAsync_False_UserIsNotOwnerOfMilestonesParentProject()
        {
            // Arrange
            const int id = 1;
            const string userId = "123";
            const string otherUserId = "12345123";
            var project = new Project {UserId = userId, Id = id};

            _projectRepository
                .Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(project);

            var user = new AppUser {Id = otherUserId};
            // Act

            var result = await _projectService.DeleteAsync(id, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void DeleteAsync_False_OnSuccess()
        {
            // Arrange
            const int id = 1;
            const string userId = "123";
            var project = new Project {UserId = userId, Id = id};

            _projectRepository
                .Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(project);
            _projectRepository.Setup(x => x.DeleteAsync(It.IsAny<int>())).ReturnsAsync(true);

            var user = new AppUser {Id = userId};
            // Act

            var result = await _projectService.DeleteAsync(id, user);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async void UpdateAsync_False_RoadmapNotFound()
        {
            // Arrange
            const int projectId = 1;
            var project = new Project {Id = projectId};
            var user = It.IsAny<AppUser>();
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Project) null);

            // Act
            var result = await _projectService.UpdateAsync(project, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void UpdateAsync_True_UserIsNotOwnerOfRoadmapsParentProject()
        {
            // Arrange
            const int projectId = 1;
            const string userId = "123";
            var user = new AppUser {Id = userId};
            var project = new Project {UserId = userId, Id = projectId};
            _projectRepository
                .Setup(x => x.GetAsync(It.IsAny<int>()))
                .ReturnsAsync(project);
            _projectRepository.Setup(x => x.UpdateAsync(It.IsAny<Project>())).ReturnsAsync(true);

            // Act
            var result = await _projectService.UpdateAsync(project, user);

            // Assert  
            result.Should().BeTrue();
        }

        [Fact]
        public async void AddImageAsync_False_ProjectNotFoundOrUserIsNotOwner()
        {
            // Arrange
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Project) null);

            // Act
            var imageAdded = await _projectService.AddImageAsync(It.IsAny<int>(), It.IsAny<AppUser>(),
                It.IsAny<IFormFile>(), It.IsAny<CancellationToken>());

            // Assert
            imageAdded.Should().BeNullOrEmpty();
        }

        [Fact]
        public async void AddImageAsync_False_FileNotUploaded()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "testId"
            };
            var project = new Project
            {
                Id = 1,
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _imageService.Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((string) null);

            // Act
            var imageAdded = await _projectService.AddImageAsync(project.Id, user, It.IsAny<IFormFile>(),
                It.IsAny<CancellationToken>());

            // Assert
            imageAdded.Should().BeNullOrEmpty();
        }

        [Fact]
        public void AddImageAsync_False_FailedToSaveToDb()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "testId"
            };
            var project = new Project
            {
                Id = 1,
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _imageService.Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync("");
            _projectRepository.Setup(x => x.UpdateAsync(It.IsAny<Project>())).ReturnsAsync(false);

            // Act
            Func<Task> imageAddedAction = async () => await _projectService.AddImageAsync(project.Id, user, It.IsAny<IFormFile>(),
                It.IsAny<CancellationToken>());

            // Assert
            imageAddedAction.Should().Throw<DataException>();
        }

        [Fact]
        public async void AddImageAsync_True_FileUploadedToStorageAndFilenameSavedToDb()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "testId"
            };
            var project = new Project
            {
                Id = 1,
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _imageService.Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync("SomeUrl");
            _imageService.Setup(x => x.GetImageUriAsync(It.IsAny<string>())).ReturnsAsync("Someurl");
            _projectRepository.Setup(x => x.UpdateAsync(It.IsAny<Project>())).ReturnsAsync(true);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);

            // Act
            var imageAdded = await _projectService.AddImageAsync(project.Id, user, It.IsAny<IFormFile>(),
                It.IsAny<CancellationToken>());

            // Assert
            imageAdded.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void UpdateImageAsync_False_ProjectNotFoundOrUserIsNotOwner()
        {
            // Arrange

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Project) null);

            // Act
            var imageUpdated = await _projectService.UpdateImageAsync(It.IsAny<int>(), It.IsAny<AppUser>(),
                It.IsAny<IFormFile>(),
                It.IsAny<CancellationToken>());

            // Assert
            imageUpdated.Should().BeNullOrEmpty();
        }

        [Fact]
        public async void UpdateImageAsync_False_CouldNotAddImage()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "testId"
            };
            var project = new Project
            {
                Id = 1,
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _imageService.Setup(x => x.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((string)null);
            _projectRepository.Setup(x => x.UpdateAsync(It.IsAny<Project>())).ReturnsAsync(true);
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _projectRepository.Setup(x => x.UpdateAsync(It.IsAny<Project>())).ReturnsAsync(true);

            // Act
            var imageUpdated = await _projectService.UpdateImageAsync(project.Id, user, It.IsAny<IFormFile>(),
                It.IsAny<CancellationToken>());

            // Assert
            imageUpdated.Should().BeNullOrEmpty();
        }

        [Fact]
        public async void DeleteImageAsync_False_ProjectNotFoundOrUserIsNotOwner()
        {
            // Arrange
            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync((Project) null);

            // Act
            var imageDeleted = await _projectService.DeleteImageAsync(It.IsAny<int>(), It.IsAny<AppUser>());

            // Assert
            imageDeleted.Should().BeFalse();
        }

        [Fact]
        public async void DeleteImageAsync_False_ProjectHasNoImage()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "id"
            };
            var project = new Project
            {
                Id = 1,
                ImageBlobName = null,
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);

            // Act
            var imageDeleted = await _projectService.DeleteImageAsync(project.Id, user);

            // Assert
            imageDeleted.Should().BeFalse();
        }

        [Fact]
        public async void DeleteImageAsync_False_CouldNotDeleteImage()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "id"
            };
            var project = new Project
            {
                Id = 1,
                ImageBlobName = "cośtam",
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _imageService.Setup(x => x.DeleteImageAsync(It.IsAny<string>())).ReturnsAsync(false);
            // Act
            var imageDeleted = await _projectService.DeleteImageAsync(project.Id, user);

            // Assert
            imageDeleted.Should().BeFalse();
        }

        [Fact]
        public async void DeleteImageAsync_False_CouldNotUpdateDatabaseAfterDeletion()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "id"
            };
            var project = new Project
            {
                Id = 1,
                ImageBlobName = "cośtam",
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _projectRepository.Setup(x => x.UpdateAsync(It.IsAny<Project>())).ReturnsAsync(false);
            _imageService.Setup(x => x.DeleteImageAsync(It.IsAny<string>())).ReturnsAsync(true);
            // Act
            var imageDeleted = await _projectService.DeleteImageAsync(project.Id, user);

            // Assert
            imageDeleted.Should().BeFalse();
        }

        [Fact]
        public async void DeleteImageAsync_True_ImageDeleted()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "id"
            };
            var project = new Project
            {
                Id = 1,
                ImageBlobName = "cośtam",
                UserId = user.Id
            };

            _projectRepository.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(project);
            _projectRepository.Setup(x => x.UpdateAsync(It.IsAny<Project>())).ReturnsAsync(true);
            _imageService.Setup(x => x.DeleteImageAsync(It.IsAny<string>())).ReturnsAsync(true);
            // Act
            var imageDeleted = await _projectService.DeleteImageAsync(project.Id, user);

            // Assert
            imageDeleted.Should().BeTrue();
        }
    }
}