using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MockQueryable.Moq;
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
            var user = new AppUser()
            {
                UserName = "test",
                Email = "test@test.com",
                DisplayName = "Test",
            };
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>())).ReturnsAsync(user)).Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);
            var principalUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, "test"),
                new Claim(ClaimTypes.Email, "test@test.com"),
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
            // Arrange
            var signInManager = new FakeSignInManagerBuilder()
                .With(s => s.Setup(sim =>
                        sim.CheckPasswordSignInAsync(It.IsAny<AppUser>(), It.IsAny<string>(), It.IsAny<bool>()))
                    .ReturnsAsync(SignInResult.Failed))
                .Build();
            var tokenService = new Mock<ITokenService>();
            var users = new List<AppUser>
            {
                new AppUser
                {
                    UserName = "taken",
                    Email = "taken@test.com",
                    DisplayName = "Test"
                }
            };
            var userStore = users.AsQueryable().BuildMock();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.SetupGet(x => x.Users).Returns(userStore.Object))
                .Build();

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object);
            var loginDto = new LoginDto { Email = "taken@test.com", Password = "Random password123@" };
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
            tokenService.Setup(s => s.GenerateRefreshToken()).Returns(new RefreshToken() { Token = "test" });
            var users = new List<AppUser>()
            {
                new AppUser()
                {
                    UserName = "taken",
                    Email = "taken@test.com",
                    DisplayName = "Test",
                }
            };
            var userStore = users.AsQueryable().BuildMock();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.SetupGet(x => x.Users).Returns(userStore.Object))
                .Build();

            var httpContext = new DefaultHttpContext();
            var controllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object)
            {
                ControllerContext = controllerContext
            };

            var loginDto = new LoginDto { Email = "taken@test.com", Password = "Random password123@" };
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
            var users = new List<AppUser>()
            {
                new AppUser()
                {
                    UserName = "taken",
                    Email = "taken@test.com",
                    DisplayName = "Test",
                }
            };
            var userStore = users.AsQueryable().BuildMock();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.SetupGet(x => x.Users).Returns(userStore.Object))
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
        public async Task RefreshToken_OkObjectResultWithUserDto_UserIsAuthorizedSuccessfuly()
        {
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var users = new List<AppUser>()
            {
                new AppUser()
                {
                    UserName = "taken",
                    Email = "taken@test.com",
                    DisplayName = "Test",
                    RefreshTokens = new List<RefreshToken>()
                    {
                        new RefreshToken()
                        {
                            Expires = DateTime.UtcNow.AddMinutes(10)
                        }
                    }
                }
            };

            var userStore = users.AsQueryable().BuildMock();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.SetupGet(x => x.Users).Returns(userStore.Object))
                .Build();

            var principalUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, "taken"),
                new Claim(ClaimTypes.Email, "taken@test.com")
            }, "mock"));

            var controllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = principalUser
                }
            };

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object)
            {
                ControllerContext = controllerContext
            };

            var result = await controller.RefreshToken();
            result.Result.Should().BeOfType<OkObjectResult>().Which.StatusCode.Should().Be((int)HttpStatusCode.OK);
        }

        [Fact]
        public async Task RefreshToken_Unauthorized_NoUserFound()
        {
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var users = new List<AppUser>()
            {
                new AppUser()
                {
                    UserName = "taken",
                    Email = "taken@test.com",
                    DisplayName = "Test",
                }
            };
            var userStore = users.AsQueryable().BuildMock();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.SetupGet(x => x.Users).Returns(userStore.Object))
                .Build();

            var principalUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, "test"),
                new Claim(ClaimTypes.Email, "test@test.com")
            }, "mock"));

            var controllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = principalUser
                }
            };

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object)
            {
                ControllerContext = controllerContext
            };

            var result = await controller.RefreshToken();
            result.Result.Should().BeOfType<UnauthorizedResult>().Which.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task RefreshToken_Unauthorized_UsersRefreshTokenIsNotActive()
        {
            var signInManager = new FakeSignInManagerBuilder().Build();
            var tokenService = new Mock<ITokenService>();
            var users = new List<AppUser>()
            {
                new AppUser()
                {
                    UserName = "taken",
                    Email = "taken@test.com",
                    DisplayName = "Test",
                    RefreshTokens = new List<RefreshToken>()
                    {
                        new RefreshToken()
                        {
                            Revoked = DateTime.UtcNow
                        }
                    }
                }
            };

            var userStore = users.AsQueryable().BuildMock();
            var userManager = new FakeUserManagerBuilder()
                .With(s => s.SetupGet(x => x.Users).Returns(userStore.Object))
                .Build();

            var principalUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, "taken"),
                new Claim(ClaimTypes.Email, "taken@test.com")
            }, "mock"));

            var controllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = principalUser
                }
            };

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object)
            {
                ControllerContext = controllerContext
            };

            var result = await controller.RefreshToken();
            result.Result.Should().BeOfType<UnauthorizedResult>().Which.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
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
            tokenService.Setup(s => s.GenerateRefreshToken()).Returns(new RefreshToken() { Token = "Test" });
            var userManager = new FakeUserManagerBuilder()
                .With(s => s
                    .Setup(u => u.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                    .ReturnsAsync(() => IdentityResult.Success))
                .Build();

            var httpContext = new DefaultHttpContext();
            var controllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            var controller = new AccountController(userManager.Object, signInManager.Object, tokenService.Object)
            {
                ControllerContext = controllerContext
            };

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