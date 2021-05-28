using System.Collections.Generic;
using System.Threading.Tasks;
using Roadmap.Domain.Models;

namespace Roadmap.Services.Projects
{
    public interface IProjectService
    {
        Task<int> AddAsync(Project project, AppUser user);

        Task<IEnumerable<Project>> GetAllAsync(AppUser user);

        Task<Project> GetAsync(int id, AppUser user);
        Task<bool> DeleteAsync(int id, AppUser user);
        Task<bool> UpdateAsync(Project project, AppUser user);
    }
}