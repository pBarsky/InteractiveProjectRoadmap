using Microsoft.AspNetCore.Identity;

namespace Roadmap.Domain.Models
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
    }
}