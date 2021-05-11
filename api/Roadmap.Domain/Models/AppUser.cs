using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Roadmap.Domain.Models
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}