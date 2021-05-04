using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;

namespace Application.Services.Milestones
{
    public interface IMilestoneService
    {
        Task<bool> CreateAsync(Milestone milestone);

        Task<ICollection<Milestone>> GetAllAsync();

        Task<Milestone> GetAsync(Guid id);

        Task<bool> RemoveAsync(Guid id);

        Task<bool> UpdateAsync(Guid id, Milestone project);
    }
}