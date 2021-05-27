using System.Collections.Generic;
using System.Threading.Tasks;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;

namespace Roadmap.Services.Milestones
{
    public class MilestoneService : IMilestoneService
    {
        private readonly IMilestoneRepository _milestoneRepository;
        private readonly IProjectRepository _projectRepository;

        public MilestoneService(IMilestoneRepository milestoneRepository, IProjectRepository projectRepository)
        {
            _milestoneRepository = milestoneRepository;
            _projectRepository = projectRepository;
        }

        public async Task<int> AddAsync(Milestone milestone, AppUser user)
        {
            if (milestone == null)
            {
                return 0;
            }

            var project = await _projectRepository.GetAsync(milestone.ParentProjectId);

            if (project.UserId != user.Id)
            {
                return 0;
            }

            return await _milestoneRepository.AddAsync(milestone);
        }

        public async Task<IEnumerable<Milestone>> GetAllOfProjectAsync(Project project, AppUser user)
        {
            if (project == null)
            {
                return null;
            }

            return await _milestoneRepository.FindAsync(x =>
                x.ParentProject.UserId == user.Id && x.ParentProjectId == project.Id);
        }

        public async Task<Milestone> GetAsync(int id, AppUser user)
        {
            if (id < 1)
            {
                return null;
            }

            var milestone = await _milestoneRepository.GetAsync(id);

            return milestone?.ParentProject?.UserId == user.Id ? milestone : null;
        }
    }
}