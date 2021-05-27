using System.Collections.Generic;
using System.Linq;
using System.Threading;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Implementations;
using Xunit;

namespace Roadmap.Domain.Tests
{
    public class MilestoneRepositoryTests
    {
        private readonly Mock<DataContext> _mockContext;
        private readonly Mock<DbSet<Milestone>> _mockDbSet;

        public MilestoneRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DataContext>().Options;
            _mockContext = new Mock<DataContext>(dbContextOptions);
            _mockDbSet = new Mock<DbSet<Milestone>>();
            _mockContext.Setup(x => x.Milestones).Returns(_mockDbSet.Object);
        }

        [Fact]
        public async void AddAsync_DefaultInt_OnFailure()
        {
            // Arrange

            _mockDbSet.Setup(x => x.AddAsync(It.IsAny<Milestone>(), CancellationToken.None));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);
            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var milestone = new Milestone() { Id = 1 };
            var resultId = await repository.AddAsync(milestone);

            // Assert
            resultId.Should().Be(default);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async void AddAsync_MilestoneId_OnSuccess()
        {
            // Arrange

            _mockDbSet.Setup(x => x.AddAsync(It.IsAny<Milestone>(), CancellationToken.None));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var milestone = new Milestone() { Id = 1 };
            var resultId = await repository.AddAsync(milestone);

            // Assert
            resultId.Should().BeGreaterThan(0);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async void DeleteAsync_False_MilestoneIsFoundAndNotSaved()
        {
            // Arrange

            _mockDbSet.Setup(x => x.FindAsync(It.IsAny<int>()))
                .ReturnsAsync(new Milestone());
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);
            _mockDbSet.Setup(x => x.Remove(It.IsAny<Milestone>()));

            var repository = new MilestoneRepository(_mockContext.Object);
            var testId = 1;

            // Act
            var resultId = await repository.DeleteAsync(testId);

            // Assert
            resultId.Should().Be(false);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async void DeleteAsync_False_MilestoneIsNotFound()
        {
            // Arrange

            _mockDbSet.Setup(x => x.FindAsync(It.IsAny<Milestone>(), CancellationToken.None))
                .ReturnsAsync((Milestone)null);
            var repository = new MilestoneRepository(_mockContext.Object);
            var testId = 1;

            // Act
            var resultId = await repository.DeleteAsync(testId);

            // Assert
            resultId.Should().Be(false);
        }

        [Fact]
        public async void DeleteAsync_True_MilestoneIsFoundAndSaved()
        {
            // Arrange

            _mockDbSet.Setup(x => x.FindAsync(It.IsAny<int>()))
                .ReturnsAsync(new Milestone());
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
            _mockDbSet.Setup(x => x.Remove(It.IsAny<Milestone>()));

            var repository = new MilestoneRepository(_mockContext.Object);
            var testId = 1;

            // Act
            var resultId = await repository.DeleteAsync(testId);

            // Assert
            resultId.Should().Be(true);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async void FindAsync_EmptyList_NoMatchesFound()
        {
            // Arrange
            var data = new List<Milestone>();
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Milestones).Returns(mockData.Object);

            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var results = await repository.FindAsync(x => x.Id != 0);

            // Assert
            results.Should().HaveCount(0);
        }

        [Fact]
        public async void FindAsync_NotEmptyList_MatchesFound()
        {
            // Arrange
            var data = new List<Milestone>
            {
                new Milestone {Id = 1},
                new Milestone {Id = 2},
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Milestones).Returns(mockData.Object);

            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var results = await repository.FindAsync(x => x.Id != 0);

            // Assert
            results.Should().HaveCountGreaterThan(0);
        }

        [Fact]
        public async void GetAsync_Milestone_MilestoneFound()
        {
            // Arrange
            var data = new List<Milestone>
            {
                new Milestone {Id = 1},
                new Milestone {Id = 2},
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Milestones).Returns(mockData.Object);

            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var results = await repository.GetAsync(It.IsAny<int>());

            // Assert
            results.Should().NotBeNull();
        }

        [Fact]
        public async void GetAsync_Null_NoMilestoneFound()
        {
            // Arrange
            var data = new List<Milestone>
            {
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Milestones).Returns(mockData.Object);
            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var results = await repository.GetAsync(It.IsAny<int>());

            // Assert
            results.Should().BeNull();
        }

        [Fact]
        public async void ListAsync_EmptyList_WhenNoDataIsPresent()
        {
            // Arrange
            var data = new List<Milestone>
            {
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Milestones).Returns(mockData.Object);

            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var results = await repository.ListAsync();

            // Assert
            results.Should().HaveCount(0);
        }

        [Fact]
        public async void ListAsync_NotEmptyList_WhenDataIsPresent()
        {
            // Arrange
            var data = new List<Milestone>
            {
                new Milestone {Id = 1},
                new Milestone {Id = 2},
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Milestones).Returns(mockData.Object);

            var repository = new MilestoneRepository(_mockContext.Object);

            // Act
            var results = await repository.ListAsync();

            // Assert
            results.Should().HaveCountGreaterThan(0);
        }

        [Fact]
        public async void UpdateAsync_false_NoUpdatesOccured()
        {
            // Arrange
            _mockDbSet.Setup(x => x.Update(It.IsAny<Milestone>()));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);

            // Act
            var repostory = new MilestoneRepository(_mockContext.Object);
            var result = await repostory.UpdateAsync(It.IsAny<Milestone>());

            // Assert
            result.Should().Be(false);
        }

        [Fact]
        public async void UpdateAsync_True_UpdatesOccured()
        {
            // Arrange
            _mockDbSet.Setup(x => x.Update(It.IsAny<Milestone>()));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

            // Act
            var repostory = new MilestoneRepository(_mockContext.Object);
            var result = await repostory.UpdateAsync(It.IsAny<Milestone>());

            // Assert
            result.Should().Be(true);
        }
    }
}