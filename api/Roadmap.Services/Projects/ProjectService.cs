using System.Collections.Generic;
using System.Threading.Tasks;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Projects;

namespace Roadmap.Services.Projects
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<int> AddAsync(Project project, AppUser user)
        {
            if (project == null)
            {
                return 0;
            }

            project.UserId = user.Id;
            return await _projectRepository.AddAsync(project);
        }

        public async Task<IEnumerable<Project>> GetAllAsync(AppUser user)
        {
            return await _projectRepository.FindAsync(x => x.UserId == user.Id);
        }

        public async Task<Project> GetAsync(int id, AppUser user)
        {
            if (id < 1)
            {
                return null;
            }

            var project = await _projectRepository.GetAsync(id);

            if (project == null)
            {
                return null;
            }

            return project.UserId == user.Id ? project : null;
        }
    }
}