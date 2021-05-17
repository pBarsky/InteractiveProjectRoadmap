using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;

namespace Roadmap.Domain.Repositories.Implementations
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly DataContext _context;

        public ProjectRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(Project project)
        {
            await _context.Projects.AddAsync(project);
            var result = await _context.SaveChangesAsync();

            return result == 0 ? 0 : project.Id;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return false;
            }

            _context.Projects.Remove(project);

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IEnumerable<Project>> FindAsync(Expression<Func<Project, bool>> predicate)
        {
            return await _context.Projects.Where(predicate).ToListAsync();
        }

        public async Task<Project> GetAsync(int id)
        {
            return await _context.Projects.FindAsync(id);
        }

        public async Task<IEnumerable<Project>> ListAsync()
        {
            return await _context.Projects.ToListAsync();
        }

        public async Task<bool> UpdateAsync(Project project)
        {
            _context.Projects.Update(project);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}