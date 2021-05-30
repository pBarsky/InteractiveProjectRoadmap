using System.Collections.Generic;
using System.Threading.Tasks;
using Roadmap.Domain.Models;

namespace Roadmap.Services.Milestones
{
    public interface IMilestoneService
    {
        Task<int> AddAsync(Milestone milestoneId, AppUser user);

        Task<IEnumerable<Milestone>> GetAllOfProjectAsync(Project project, AppUser user);

        Task<Milestone> GetAsync(int milestoneId, AppUser user);
        Task<bool> DeleteAsync(int id, AppUser user);
        Task<bool> UpdateAsync(Milestone project, AppUser user);
    }
}