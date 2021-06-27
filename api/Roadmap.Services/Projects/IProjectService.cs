using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
        Task<string> AddImageAsync(int projectId, AppUser user, IFormFile file, CancellationToken cancellationToken);
        Task<string> UpdateImageAsync(int projectId, AppUser user, IFormFile file, CancellationToken cancellationToken);
        Task<bool> DeleteImageAsync(int projectId, AppUser user);
    }
}