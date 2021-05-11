using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Roadmap.Domain.Models;

namespace Roadmap.Domain
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser {DisplayName = "George", UserName = "george", Email = "george@test.com"},
                    new AppUser {DisplayName = "Jane", UserName = "jane", Email = "jane@test.com"}
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "TestPa$$w0rd");
                }
            }

            await context.SaveChangesAsync();
        }
    }
}