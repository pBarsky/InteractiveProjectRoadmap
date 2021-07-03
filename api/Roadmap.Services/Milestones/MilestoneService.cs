using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Roadmap.Domain.Migrations;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Mapper;

namespace Roadmap.Services.Milestones
{
    public class MilestoneService : IMilestoneService
    {
        private readonly IMapper _mapper;
        private readonly IMilestoneRepository _milestoneRepository;
        private readonly IProjectRepository _projectRepository;

        public MilestoneService(IMilestoneRepository milestoneRepository, IProjectRepository projectRepository)
        {
            _milestoneRepository = milestoneRepository;
            _projectRepository = projectRepository;
            _mapper = new AutoMapper.Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new AutoMapperProfile())));
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

            if (milestone.ConnectedToId == null)
            {
                return await _milestoneRepository.AddAsync(milestone);
            }

            var connectedMilestone = await GetConnectedMilestone(milestone);
            if (connectedMilestone == null)
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

        public async Task<bool> DeleteAsync(int id, AppUser user)
        {
            if (id < 1)
            {
                return false;
            }

            var milestone = await _milestoneRepository.GetAsync(id);

            if (milestone == null || milestone.ParentProject.UserId != user.Id)
            {
                return false;
            }

            var connectedMilestone = await GetSourceConnectedToMilestone(milestone);
            if (connectedMilestone == null)
            {
                return await _milestoneRepository.DeleteAsync(id);
            }

            connectedMilestone.ConnectedToId = null;
            var updatedConnectedMilestone = await _milestoneRepository.UpdateAsync(connectedMilestone);
            if (!updatedConnectedMilestone)
            {
                return false;
            }

            return await _milestoneRepository.DeleteAsync(id);
        }


        public async Task<bool> UpdateAsync(Milestone srcMilestone, AppUser user)
        {
            var destMilestone = await _milestoneRepository.GetAsync(srcMilestone.Id);
            if (destMilestone == null || destMilestone.ParentProject.UserId != user.Id)
            {
                return false;
            }

            _mapper.Map(srcMilestone, destMilestone);


            if (destMilestone.ConnectedToId == null)
            {
                return await _milestoneRepository.UpdateAsync(destMilestone);
            }

            var connectedMilestone = await GetConnectedMilestone(destMilestone);
            if (connectedMilestone == null)
            {
                return false;
            }

            return await _milestoneRepository.UpdateAsync(destMilestone);
        }

        private async Task<Milestone> GetSourceConnectedToMilestone(Milestone milestone)
        {
            return (await _milestoneRepository.FindAsync(x => x.ConnectedToId == milestone.Id && x.ParentProjectId == milestone.ParentProjectId)).FirstOrDefault();
        }

        private async Task<Milestone> GetConnectedMilestone(Milestone milestone)
        {
            return (await _milestoneRepository.FindAsync(x => x.Id == milestone.ConnectedToId && x.ParentProjectId == milestone.ParentProjectId)).FirstOrDefault();
        }
    }
}