using System.Security.Claims;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Roadmap.API.Controllers;
using Roadmap.API.DTOs;
using Roadmap.API.Mapper;
using Roadmap.API.Tests.FakeClasses;
using Roadmap.API.Tests.FakeClasses.Builders;
using Roadmap.Domain.Models;
using Roadmap.Services.Images;
using Roadmap.Services.Todos;
using Xunit;

namespace Roadmap.API.Tests
{
    public class TodosControllerTests
    {
        private readonly IMapper _mapper;
        private readonly Mock<ITodoService> _todoService;
        private readonly AppUser _testUser;
        private readonly Mock<FakeUserManager> _userManager;

        public TodosControllerTests()
        {
            _testUser = new AppUser {Id = "SomeUserId"};
            _userManager = new FakeUserManagerBuilder().With(s =>
                s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(_testUser)).Build();
            _todoService = new Mock<ITodoService>();
            _mapper = new AutoMapper.Mapper(new MapperConfiguration(cfg =>
                cfg.AddProfile(new AutoMapperProfile(new Mock<IImageService>().Object))));
        }

        [Fact]
        public async void Get_BadRequestObjectResult_TodoNotFound()
        {
            // Arrange

            _todoService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>()))
                .ReturnsAsync((Todo) null);

            var controller = new TodosController(_todoService.Object,
                _userManager.Object, _mapper);

            // Act
            var todo = await controller.Get(1);

            // Assert
            todo.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Get_OkObjectResultWithTodoDto_TodoFound()
        {
            // Arrange

            _todoService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<AppUser>()))
                .ReturnsAsync(new Todo());

            var controller = new TodosController(_todoService.Object,
                _userManager.Object, _mapper);

            // Act
            var todo = await controller.Get(1);

            // Assert
            todo.Result.Should().BeOfType<OkObjectResult>().Which.Value.Should().BeOfType<TodoDto>();
        }


        [Fact]
        public async void Post_BadRequestObjectResult_TodoDtoIsNull()
        {
            // Arrange
            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(null);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Post_UnauthorizedObjectResult_UserWasNotFound()
        {
            // Arrange
            var todo = new TodoDto();
            _userManager.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync((AppUser) null);

            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(todo);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
        }

        [Fact]
        public async void Post_BadRequestObjectResult_TodoDidNotBelongToUserOrCouldNotSaveChanges()
        {
            // Arrange
            var todo = new TodoDto();
            _todoService.Setup(x => x.AddAsync(It.IsAny<Todo>(), It.IsAny<AppUser>())).ReturnsAsync(default(int));

            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(todo);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Post_OkObjectResultWithIdOfCreatedTodo_OnSuccess()
        {
            // Arrange
            const int todoId = 1;
            var todo = new TodoDto();
            _todoService.Setup(x => x.AddAsync(It.IsAny<Todo>(), It.IsAny<AppUser>())).ReturnsAsync(todoId);

            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Post(todo);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<int>().Should().Be(todoId);
        }

        [Fact]
        public async void Put_BadRequestObjectResult_TodoDidNotBelongToUserOrCouldNotSaveChanges()
        {
            // Arrange
            var todo = new TodoDto();
            _todoService.Setup(x => x.UpdateAsync(It.IsAny<Todo>(), It.IsAny<AppUser>())).ReturnsAsync(false);

            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Put(todo);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Put_BadRequestObjectResult_UserNoutFound()
        {
            // Arrange
            var todo = new TodoDto();
            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Put(todo);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Put_UnauthorizedWithMessage_UserNotFound()
        {
            // Arrange
            var todo = new TodoDto();
            _todoService.Setup(x => x.UpdateAsync(It.IsAny<Todo>(), It.IsAny<AppUser>())).ReturnsAsync(true);
            var userManager = new FakeUserManagerBuilder().With(s =>
                s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync((AppUser) null)).Build();
            var controller =
                new TodosController(_todoService.Object, userManager.Object, _mapper);

            // Act
            var result = await controller.Put(todo);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>().Which.Value.As<string>().Should()
                .NotBeNullOrEmpty();
        }


        [Fact]
        public async void Put_OkObjectResultWithTrue_OnSuccess()
        {
            // Arrange
            var todo = new TodoDto();
            _todoService.Setup(x => x.UpdateAsync(It.IsAny<Todo>(), It.IsAny<AppUser>())).ReturnsAsync(true);

            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Put(todo);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<bool>().Should().BeTrue();
        }

        [Fact]
        public async void Delete_BadRequestObjectResult_TodoDidNotBelongToUserOrCouldNotSaveChanges()
        {
            // Arrange  
            _todoService.Setup(x => x.DeleteAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync(false);

            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Delete(1);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void Delete_OkObjectResult_OnSuccess()
        {
            // Arrange  
            _todoService.Setup(x => x.DeleteAsync(It.IsAny<int>(), It.IsAny<AppUser>())).ReturnsAsync(true);

            var controller =
                new TodosController(_todoService.Object, _userManager.Object, _mapper);

            // Act
            var result = await controller.Delete(1);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>().Which.Value.As<bool>().Should().BeTrue();
        }


        [Fact]
        public async void Delete_Unauthorized_UserWasNotFound()
        {
            // Arrange
            _todoService.Setup(x => x.UpdateAsync(It.IsAny<Todo>(), It.IsAny<AppUser>())).ReturnsAsync(true);
            var userManager = new FakeUserManagerBuilder().With(s =>
                s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync((AppUser) null)).Build();
            var controller =
                new TodosController(_todoService.Object, userManager.Object, _mapper);

            // Act
            var result = await controller.Delete(1);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
        }
    }
}