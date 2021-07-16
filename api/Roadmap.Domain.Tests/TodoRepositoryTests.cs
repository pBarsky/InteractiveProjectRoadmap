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
    public class TodoRepositoryTests
    {
        private readonly Mock<DataContext> _mockContext;
        private readonly Mock<DbSet<Todo>> _mockDbSet;

        public TodoRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DataContext>().Options;
            _mockContext = new Mock<DataContext>(dbContextOptions);
            _mockDbSet = new Mock<DbSet<Todo>>();
            _mockContext.Setup(x => x.Todos).Returns(_mockDbSet.Object);
        }

        [Fact]
        public async void AddAsync_DefaultInt_OnFailure()
        {
            // Arrange

            _mockDbSet.Setup(x => x.AddAsync(It.IsAny<Todo>(), CancellationToken.None));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);
            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var milestone = new Todo {Id = 1};
            var resultId = await repository.AddAsync(milestone);

            // Assert
            resultId.Should().Be(default);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async void AddAsync_TodoId_OnSuccess()
        {
            // Arrange

            _mockDbSet.Setup(x => x.AddAsync(It.IsAny<Todo>(), CancellationToken.None));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var milestone = new Todo {Id = 1};
            var resultId = await repository.AddAsync(milestone);

            // Assert
            resultId.Should().BeGreaterThan(0);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async void DeleteAsync_False_TodoIsFoundAndNotSaved()
        {
            // Arrange

            _mockDbSet.Setup(x => x.FindAsync(It.IsAny<int>()))
                .ReturnsAsync(new Todo());
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);
            _mockDbSet.Setup(x => x.Remove(It.IsAny<Todo>()));

            var repository = new TodoRepository(_mockContext.Object);
            var testId = 1;

            // Act
            var resultId = await repository.DeleteAsync(testId);

            // Assert
            resultId.Should().Be(false);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async void DeleteAsync_False_TodoIsNotFound()
        {
            // Arrange

            _mockDbSet.Setup(x => x.FindAsync(It.IsAny<Todo>(), CancellationToken.None))
                .ReturnsAsync((Todo) null);
            var repository = new TodoRepository(_mockContext.Object);
            var testId = 1;

            // Act
            var resultId = await repository.DeleteAsync(testId);

            // Assert
            resultId.Should().Be(false);
        }

        [Fact]
        public async void DeleteAsync_True_TodoIsFoundAndSaved()
        {
            // Arrange

            _mockDbSet.Setup(x => x.FindAsync(It.IsAny<int>()))
                .ReturnsAsync(new Todo());
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
            _mockDbSet.Setup(x => x.Remove(It.IsAny<Todo>()));

            var repository = new TodoRepository(_mockContext.Object);
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
            var data = new List<Todo>();
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);

            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var results = await repository.FindAsync(x => x.Id != 0);

            // Assert
            results.Should().HaveCount(0);
        }

        [Fact]
        public async void FindAsync_NotEmptyList_MatchesFound()
        {
            // Arrange
            var data = new List<Todo>
            {
                new Todo {Id = 1},
                new Todo {Id = 2}
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);

            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var results = await repository.FindAsync(x => x.Id != 0);

            // Assert
            results.Should().HaveCountGreaterThan(0);
        }

        [Fact]
        public async void FindSingleOrDefault_Null_NoMatchesFound()
        {
            // Arrange
            var data = new List<Todo>();
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);

            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var results = await repository.FindSingleOrDefault(x => x.Id == 1);

            // Assert
            results.Should().BeNull();
        }

        [Fact]
        public async void FindSingleOrDefault_NotNull_MatchFound()
        {
            // Arrange
            const int findableId = 1;
            var data = new List<Todo>
            {
                new Todo {Id = findableId},
                new Todo {Id = 2}
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);

            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var results = await repository.FindSingleOrDefault(x => x.Id == findableId);

            // Assert
            results.Should().NotBeNull();
        }

        [Fact]
        public async void GetAsync_Todo_TodoFound()
        {
            const int id = 1;
            const string name = "name";
            // Arrange
            var data = new List<Todo>
            {
                new Todo {Id = id, Name = name},
                new Todo {Id = 2}
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);

            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var result = await repository.GetAsync(id);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(id);
            result.Name.Should().Be(name);
        }

        [Fact]
        public async void GetAsync_Null_NoTodoFound()
        {
            // Arrange
            var data = new List<Todo>();
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);
            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var results = await repository.GetAsync(It.IsAny<int>());

            // Assert
            results.Should().BeNull();
        }

        [Fact]
        public async void ListAsync_EmptyList_WhenNoDataIsPresent()
        {
            // Arrange
            var data = new List<Todo>();
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);

            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var results = await repository.ListAsync();

            // Assert
            results.Should().HaveCount(0);
        }

        [Fact]
        public async void ListAsync_NotEmptyList_WhenDataIsPresent()
        {
            // Arrange
            var data = new List<Todo>
            {
                new Todo {Id = 1},
                new Todo {Id = 2}
            };
            var mockData = data.AsQueryable().BuildMockDbSet();
            _mockContext.Setup(x => x.Todos).Returns(mockData.Object);

            var repository = new TodoRepository(_mockContext.Object);

            // Act
            var results = await repository.ListAsync();

            // Assert
            results.Should().HaveCountGreaterThan(0);
        }

        [Fact]
        public async void UpdateAsync_false_NoUpdatesOccured()
        {
            // Arrange
            _mockDbSet.Setup(x => x.Update(It.IsAny<Todo>()));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);

            // Act
            var repostory = new TodoRepository(_mockContext.Object);
            var result = await repostory.UpdateAsync(It.IsAny<Todo>());

            // Assert
            result.Should().Be(false);
        }

        [Fact]
        public async void UpdateAsync_True_UpdatesOccured()
        {
            // Arrange
            _mockDbSet.Setup(x => x.Update(It.IsAny<Todo>()));
            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

            // Act
            var repostory = new TodoRepository(_mockContext.Object);
            var result = await repostory.UpdateAsync(It.IsAny<Todo>());

            // Assert
            result.Should().Be(true);
        }
    }
}
