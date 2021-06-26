using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Images;
using Roadmap.Services.Mapper;

namespace Roadmap.Services.Projects
{
    public class ProjectService : IProjectService
    {
        private readonly IMapper _mapper;
        private readonly IProjectRepository _projectRepository;
        private readonly IImageService _imageService;

        public ProjectService(IProjectRepository projectRepository, IImageService imageService)
        {
            _projectRepository = projectRepository;
            _imageService = imageService;
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

        public async Task<bool> AddImageAsync(int projectId, AppUser user, IFormFile file,
            CancellationToken cancellationToken)
        {
            var project = await GetAsync(projectId, user);
            if (project == null)
            {
                return false;
            }

            var imageBlobName = await _imageService.UploadImageAsync(file, cancellationToken);
            if (imageBlobName == null)
            {
                return false;
            }

            project.ImageBlobName = imageBlobName;
            var saved = await UpdateAsync(project, user);

            return saved;
        }

        public async Task<bool> UpdateImageAsync(int projectId, AppUser user, IFormFile file,
            CancellationToken cancellationToken)
        {
            var project = await GetAsync(projectId, user);
            if (project == null)
            {
                return false;
            }

            await DeleteImageAsync(projectId, user);

            return await AddImageAsync(projectId, user, file, cancellationToken);
        }

        public async Task<bool> DeleteImageAsync(int projectId, AppUser user)
        {
            var project = await GetAsync(projectId, user);
            if (project == null)
            {
                return false;
            }

            if (string.IsNullOrEmpty(project.ImageBlobName))
            {
                return false;
            }

            var imageDeleted = await _imageService.DeleteImageAsync(project.ImageBlobName);
            if (!imageDeleted)
            {
                return false;
            }

            project.ImageBlobName = null;

            return await UpdateAsync(project, user);
        }
    }
}