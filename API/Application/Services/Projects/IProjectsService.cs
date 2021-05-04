using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;

namespace Application.Services.Projects
{
    public interface IProjectsService
    {
        Task<bool> CreateAsync(Project t);

        Task<ICollection<Project>> GetAllAsync();

        Task<Project> GetAsync(Guid id);

        Task<bool> RemoveAsync(Guid id);

        Task<bool> UpdateAsync(Guid id, Project project);
    }
}