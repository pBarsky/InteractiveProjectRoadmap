using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Roadmap.Domain.Models;
using Roadmap.Services.Token;
using Xunit;

namespace Roadmap.Services.Tests
{
    public class TokenServiceTests
    {
        private IConfiguration _config;

        public TokenServiceTests()
        {
            var testConfig = new Dictionary<string, string>()
            {
                {"TokenKey", "HarnaœPer³aTyskieKasztelanTatra"}
            };
            _config = new ConfigurationBuilder().AddInMemoryCollection(testConfig).Build();
        }

        [Fact]
        public void CreateToken_IsTokenValidForADay()
        {
            // Arrange
            var tokenService = new TokenService(_config);

            var testAppUser = new AppUser()
            {
                UserName = "testuser",
                Id = "testuserid",
                Email = "testuser@test.com"
            };

            // Act
            var token = tokenService.CreateToken(testAppUser);

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var decodedToken = jsonToken as JwtSecurityToken;

            decodedToken.Should().NotBe(null);

            var decodedTokenValidTo = decodedToken?.ValidTo;

            // Assert
            decodedTokenValidTo.Should().BeCloseTo(DateTime.Now.AddDays(1).ToUniversalTime(), 60_000);
        }
    }
}