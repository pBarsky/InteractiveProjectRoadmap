using Roadmap.Domain.Models;

namespace Roadmap.Services.Token
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);

        RefreshToken GenerateRefreshToken();
    }
}