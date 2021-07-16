using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using FluentAssertions;
using Moq;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Milestones;
using Roadmap.Services.Todos;
using Xunit;

namespace Roadmap.Services.Tests
{
    public class TodoServiceTests
    {
        private readonly Mock<ITodoRepository> _todoRepository;

        private readonly TodoService _todoService;
        private readonly Mock<IMilestoneService> _milestoneService;

        public TodoServiceTests()
        {
            _todoRepository = new Mock<ITodoRepository>();
            _milestoneService = new Mock<IMilestoneService>();
            _todoService = new TodoService(_todoRepository.Object, _milestoneService.Object);
        }

        [Fact]
        public async void AddAsync_0_OnFailure()
        {
            // Arrange
            _todoRepository.Setup(x => x.AddAsync(It.IsAny<Todo>())).ReturnsAsync(0);
            _milestoneService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>()))
                .ReturnsAsync((Milestone) null);

            // Act
            var todo = new Todo {ParentMilestoneId = 1};
            var result = await _todoService.AddAsync(todo, new AppUser());

            // Assert
            result.Should().Be(0);
        }

        [Fact]
        public async void AddAsync_0_PassedTodoIsNull()
        {
            // Arrange

            // Act
            var result = await _todoService.AddAsync(null, new AppUser());

            // Assert
            result.Should().Be(0);
        }


        [Fact]
        public async void AddAsync_CreatedTodo_OnSuccess()
        {
            // Arrange
            _todoRepository.Setup(x => x.AddAsync(It.IsAny<Todo>())).ReturnsAsync(1);
            _milestoneService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>()))
                .ReturnsAsync(new Milestone());

            // Act
            var todo = new Todo {ParentMilestoneId = 1};
            var result = await _todoService.AddAsync(todo,
                new AppUser());

            // Assert
            result.Should().BePositive();
        }

        [Fact]
        public async void GetAllOfMilestoneAsync_EmptyList_NoMatchesFound()
        {
            // Arrange
            _todoRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Todo, bool>>>()))
                .ReturnsAsync(new List<Todo>());
            var project = new Project {Id = 1, UserId = "1"};
            var milestone = new Milestone {ParentProject = project, Id = 1};
            // Act
            var todos = await _todoService.GetAllOfMilestoneAsync(milestone, new AppUser {Id = project.UserId});

            // Assert
            todos.Should().NotBeNull().And.HaveCount(0);
        }

        [Fact]
        public async void GetAllOfMilestoneAsync_Todos_MatchesFound()
        {
            // Arrange
            var project = new Project {Id = 1, UserId = "1"};
            var milestone = new Milestone {ParentProject = project, Id = 1};
            _todoRepository.Setup(x => x.FindAsync(It.IsAny<Expression<Func<Todo, bool>>>()))
                .ReturnsAsync(new List<Todo> {new Todo {ParentMilestoneId = milestone.Id}});
            // Act
            var todos = await _todoService.GetAllOfMilestoneAsync(milestone, new AppUser {Id = project.UserId});

            // Assert
            todos.Should().NotBeNull().And.HaveCountGreaterThan(0);
        }

        [Fact]
        public async void GetAllOfMilestoneAsync_Null_ParentMilestoneIsNull()
        {
            // Arrange
            // Act
            var milestones = await _todoService.GetAllOfMilestoneAsync(null, new AppUser());

            // Assert
            milestones.Should().BeNull();
        }

        [Fact]
        public async void GetAsync_Todo_TodoFound()
        {
            // Arrange
            var user = new AppUser {Id = "1"};
            var project = new Project {Id = 1, UserId = user.Id};
            var milestone = new Milestone {Id = 1, ParentProject = project, ParentProjectId = project.Id};

            _todoRepository.Setup(x => x.FindSingleOrDefault(It.IsAny<Expression<Func<Todo, bool>>>()))
                .ReturnsAsync(new Todo());

            // Act
            var todo = await _todoService.GetAsync(1, user);

            // Assert
            todo.Should().NotBeNull();
        }

        [Fact]
        public async void GetAsync_Null_IdDoesNotMakeSense()
        {
            // Arrange
            const string userId = "123";
            var user = new AppUser {Id = userId};

            // Act
            var todo = await _todoService.GetAsync(-2, user);

            // Assert
            todo.Should().BeNull();
        }

        [Fact]
        public async void DeleteAsync_False_IdIsInvalid()
        {
            // Arrange
            const int invalidId = -1;
            var user = It.IsAny<AppUser>();

            // Act
            var result = await _todoService.DeleteAsync(invalidId, user);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void DeleteAsync_False_TodoNotFound()
        {
            // Arrange
            const int id = 1;
            var user = It.IsAny<AppUser>();
            _todoRepository.Setup(x => x.FindSingleOrDefault(It.IsAny<Expression<Func<Todo, bool>>>()))
                .ReturnsAsync((Todo) null);

            // Act
            var result = await _todoService.DeleteAsync(id, user);

            // Assert
            result.Should().BeFalse();
        }

        [
            Fact]
        public async void DeleteAsync_True_OnSuccess()
        {
            // Arrange
            _todoRepository.Setup(x => x.FindSingleOrDefault(It.IsAny<Expression<Func<Todo, bool>>>()))
                .ReturnsAsync(new Todo());
            _todoRepository.Setup(x => x.DeleteAsync(It.IsAny<int>())).ReturnsAsync(true);
            // Act
            var result = await _todoService.DeleteAsync(1, new AppUser());

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async void UpdateAsync_False_PassedTodoIsNull()
        {
            // Arrange

            // Act
            var result = await _todoService.UpdateAsync(null, new AppUser());

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void UpdateAsync_False_PassedTodoDoesntExist()
        {
            // Arrange
            _todoRepository.Setup(x => x.FindSingleOrDefault(It.IsAny<Expression<Func<Todo, bool>>>()))
                .ReturnsAsync((Todo) null);

            // Act
            var result = await _todoService.UpdateAsync(new Todo(), new AppUser());

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async void UpdateAsync_True_UserIsNotOwnerOfTodosParentMilestone()
        {
            // Arrange
            _todoRepository.Setup(x => x.FindSingleOrDefault(It.IsAny<Expression<Func<Todo, bool>>>()))
                .ReturnsAsync(new Todo());
            _todoRepository.Setup(x => x.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync(true);


            // Act
            var result = await _todoService.UpdateAsync(new Todo(), new AppUser());

            // Assert  
            result.Should().BeTrue();
        }
    }
}