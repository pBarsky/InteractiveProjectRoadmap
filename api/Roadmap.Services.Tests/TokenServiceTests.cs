using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using Roadmap.Domain.Models;
using Roadmap.Services.Token;
using Xunit;

namespace Roadmap.Services.Tests
{
    public class TokenServiceTests
    {
        private readonly IConfiguration _config;

        private readonly ITokenService _tokenService;

        public TokenServiceTests()
        {
            var testConfig = new Dictionary<string, string>()
            {
                {"TokenKey", "HarnaœPer³aTyskieKasztelanTatra"}
            };
            _config = new ConfigurationBuilder().AddInMemoryCollection(testConfig).Build();
            _tokenService = new TokenService(_config);
        }

        [Fact]
        public void CreateToken_IsTokenValidForADay()
        {
            // Arrange
            var testAppUser = new AppUser()
            {
                UserName = "testuser",
                Id = "testuserid",
                Email = "testuser@test.com"
            };

            // Act
            var token = _tokenService.CreateToken(testAppUser);

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var decodedToken = jsonToken as JwtSecurityToken;

            decodedToken.Should().NotBe(null);

            var decodedTokenValidTo = decodedToken?.ValidTo;

            // Assert
            decodedTokenValidTo.Should().BeCloseTo(DateTime.UtcNow.AddMinutes(5), 60_000);
        }

        [Fact]
        public void GenerateRefreshToken_AnyString_Always()
        {
            // Act
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Assert
            refreshToken.Should().BeOfType(typeof(RefreshToken));
            refreshToken.Token.Should().NotBeNullOrEmpty();
        }
    }
}