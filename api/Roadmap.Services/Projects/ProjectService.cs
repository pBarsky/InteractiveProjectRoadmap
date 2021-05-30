using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Mapper;

namespace Roadmap.Services.Projects
{
    public class ProjectService : IProjectService
    {
        private readonly IMapper _mapper;
        private readonly IProjectRepository _projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
            _mapper = new AutoMapper.Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new AutoMapperProfile())));
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

        public async Task<bool> DeleteAsync(int id, AppUser user)
        {
            if (id < 1)
            {
                return false;
            }

            var project = await _projectRepository.GetAsync(id);

            if (project == null || project.UserId != user.Id)
            {
                return false;
            }

            return await _projectRepository.DeleteAsync(id);
        }

        public async Task<bool> UpdateAsync(Project srcProject, AppUser user)
        {
            var destProject = await _projectRepository.GetAsync(srcProject.Id);
            if (destProject == null || destProject.UserId != user.Id)
            {
                return false;
            }

            _mapper.Map(srcProject, destProject);

            return await _projectRepository.UpdateAsync(destProject);
        }
    }
}