using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Roadmap.API.Controllers;
using Roadmap.API.DTOs;
using Roadmap.API.Tests.FakeClasses.Builders;
using Roadmap.Domain.Models;
using Roadmap.Services.Token;
using Xunit;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Roadmap.API.Tests
{
    public class AccountControllerTests
    {
        [Fact]
        public async Task GetCurrentUser_ReturnsUser_WhenAuthenticated()
        {
            // Arrange
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var userManager = new FakeUserManagerBuilder()
                .With(x => x.Setup(s => s.FindByEmailAsync(It.IsAny<string>()))
                    .Returns(Task.FromResult(new AppUser
                    {
                        DisplayName = "Test",
                        UserName = "test",
                        Id = "testId",
                        Email = "test@test.com"
                    })))
                .Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);
            var principalUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, "test"),
            }, "mock"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principalUser }
            };

            // Act
            var result = await controller.GetCurrentUser();

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be((int)HttpStatusCode.OK);
            result.Result.Should().BeOfType<OkObjectResult>()
                .Which.Value.Should().BeOfType<UserDto>().Which.DisplayName.Should().Be("Test");
        }

        [Fact]
        public async Task Login__ReturnsUnauthorized_WhenPasswordDoesNotMatch()
        {
            var signInManager = new FakeSignInManagerBuilder()
                .With(s => s.Setup(sim =>
                        sim.CheckPasswordSignInAsync(It.IsAny<AppUser>(), It.IsAny<string>(), It.IsAny<bool>()))
                    .ReturnsAsync(SignInResult.Failed))
                .Build();
            var tokenService = new Mock<ITokenService>();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.Setup(u => u.FindByEmailAsync("notTaken@test.com"))
                    .ReturnsAsync(new AppUser()))
                .Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);
            var loginDto = new LoginDto { Email = "notTaken@test.com", Password = "Random password123@" };
            // Act
            var result = await controller.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedResult>().Which.StatusCode.Should()
                .Be((int)HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task Login__ReturnsUserDto_WhenLoginIsSuccessful()
        {
            var signInManager = new FakeSignInManagerBuilder()
                .With(s => s.Setup(sim =>
                        sim.CheckPasswordSignInAsync(It.IsAny<AppUser>(), It.IsAny<string>(), It.IsAny<bool>()))
                    .ReturnsAsync(SignInResult.Success))
                .Build();
            var tokenService = new Mock<ITokenService>();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.Setup(u => u.FindByEmailAsync("notTaken@test.com"))
                    .ReturnsAsync(new AppUser()))
                .Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);
            var loginDto = new LoginDto { Email = "notTaken@test.com", Password = "Random password123@" };
            // Act
            var result = await controller.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>().Which.StatusCode.Should()
                .Be((int)HttpStatusCode.OK);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserIsNotFound()
        {
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.Setup(u => u.FindByEmailAsync("notTaken@test.com"))
                    .ReturnsAsync((AppUser)null))
                .Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);
            var loginDto = new LoginDto { Email = "notTaken@test.com", Password = "Random password123@" };
            // Act
            var result = await controller.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedResult>().Which.StatusCode.Should()
                .Be((int)HttpStatusCode.Unauthorized);
        }

        [Theory]
        [InlineData("taken", "notTaken@test.com")]
        [InlineData("notTaken", "taken@test.com")]
        public async Task Register_ReturnsBadRequest_WhenEmailOrUserNameAreTaken(string userName, string email)
        {
            // Arrange
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.Setup(u => u.FindByEmailAsync("taken@test.com"))
                    .ReturnsAsync(new AppUser()))
                .With(s => s.Setup(u => u.FindByNameAsync("taken"))
                    .ReturnsAsync(new AppUser())).Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);
            var registerDto = FilledRegisterDto(email: email, userName: userName);
            // Act
            var result = await controller.Register(registerDto);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>().Which.StatusCode.Should()
                .Be((int)HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Register_ReturnsBadRequestRequest_WhenUserIsNotCreatedSuccessfully()
        {
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s
                    .Setup(u => u.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                    .ReturnsAsync(() => IdentityResult.Failed()))
                .Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);

            var registerDto = FilledRegisterDto();

            // Act
            var result = await controller.Register(registerDto);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>().Which.StatusCode.Should()
                .Be((int)HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Register_ReturnsOkRequest_WhenUserIsCreatedSuccessfully()
        {
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s
                    .Setup(u => u.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                    .ReturnsAsync(() => IdentityResult.Success))
                .Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);

            var registerDto = FilledRegisterDto();

            // Act
            var result = await controller.Register(registerDto);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>().Which.StatusCode.Should()
                .Be((int)HttpStatusCode.OK);
        }

        private static RegisterDto FilledRegisterDto(string displayName = "Test", string email = "test@test.com",
            string password = "T3st___test", string userName = "test")
        {
            return new RegisterDto
            {
                DisplayName = displayName,
                Email = email,
                Password = password,
                Username = userName
            };
        }
    }
}