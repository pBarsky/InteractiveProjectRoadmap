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
    public class MilestoneRepository : IMilestoneRepository
    {
        private readonly DataContext _context;

        public MilestoneRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(Milestone milestone)
        {
            await _context.Milestones.AddAsync(milestone);
            var result = await _context.SaveChangesAsync();

            return result == 0 ? 0 : milestone.Id;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var milestone = await _context.Milestones.FindAsync(id);
            if (milestone == null)
            {
                return false;
            }

            _context.Milestones.Remove(milestone);

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IEnumerable<Milestone>> FindAsync(Expression<Func<Milestone, bool>> predicate)
        {
            return await _context.Milestones.Where(predicate).ToListAsync();
        }

        public async Task<Milestone> GetAsync(int id)
        {
            return await _context.Milestones.Include(x => x.ParentProject).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Milestone>> ListAsync()
        {
            return await _context.Milestones.ToListAsync();
        }

        public async Task<bool> UpdateAsync(Milestone milestone)
        {
            _context.Milestones.Update(milestone);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}