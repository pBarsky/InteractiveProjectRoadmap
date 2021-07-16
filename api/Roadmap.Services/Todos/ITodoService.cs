using System.Collections.Generic;
using System.Threading.Tasks;
using Roadmap.Domain.Models;

namespace Roadmap.Services.Todos
{
    public interface ITodoService
    {
        Task<int> AddAsync(Todo todo, AppUser user);
        Task<IEnumerable<Todo>> GetAllOfMilestoneAsync(Milestone milestone, AppUser user);
        Task<Todo> GetAsync(int id, AppUser user);
        Task<bool> DeleteAsync(int id, AppUser user);
        Task<bool> UpdateAsync(Todo todo, AppUser user);
    }
}