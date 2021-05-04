using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Services.Projects
{
    public class ProjectsService : IProjectsService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProjectsService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> CreateAsync(Project t)
        {
            await _context.Projects.AddAsync(t);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<ICollection<Project>> GetAllAsync()
        {
            var projects = await _context.Projects.Include(p => p.RootMilestone).ToListAsync();
            return projects;
        }

        public async Task<Project> GetAsync(Guid id)
        {
            var project = await _context.Projects.FindAsync(id);
            return project;
        }

        public async Task<bool> RemoveAsync(Guid id)
        {
            var project = await GetAsync(id);
            if (project == null)
            {
                return false;
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(Guid id, Project project)
        {
            var oldProject = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return false;
            }

            _mapper.Map(project, oldProject);

            _context.Projects.Update(oldProject);

            var result = await _context.SaveChangesAsync();

            return result > 0;
        }
    }
}