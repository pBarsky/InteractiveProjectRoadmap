using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Services.Milestones
{
    public class MilestoneService : IMilestoneService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MilestoneService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> CreateAsync(Milestone milestone)
        {
            var project = await _context.Projects.FindAsync(milestone.ParentProjectId);
            milestone.ParentProject = project;

            await _context.Milestones.AddAsync(milestone);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<ICollection<Milestone>> GetAllAsync()
        {
            var projects = await _context.Milestones.Include(m => m.SubMilestones).ToListAsync();
            return projects;
        }

        public async Task<Milestone> GetAsync(Guid id)
        {
            var project = await _context.Milestones.FindAsync(id);
            return project;
        }

        public async Task<bool> RemoveAsync(Guid id)
        {
            var project = await GetAsync(id);
            if (project == null)
            {
                return false;
            }

            _context.Milestones.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(Guid id, Milestone project)
        {
            var oldMilestone = await _context.Milestones.FindAsync(id);
            if (project == null)
            {
                return false;
            }

            _mapper.Map(project, oldMilestone);

            _context.Milestones.Update(oldMilestone);

            var result = await _context.SaveChangesAsync();

            return result > 0;
        }
    }
}