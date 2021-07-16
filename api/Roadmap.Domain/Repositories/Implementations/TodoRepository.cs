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
    public class TodoRepository : ITodoRepository
    {
        private readonly DataContext _context;

        public TodoRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(Todo todo)
        {
            await _context.Todos.AddAsync(todo);
            var result = await _context.SaveChangesAsync();

            return result == 0 ? 0 : todo.Id;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return false;
            }

            _context.Todos.Remove(todo);

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IEnumerable<Todo>> FindAsync(Expression<Func<Todo, bool>> predicate)
        {
            return await _context.Todos.Where(predicate).ToListAsync();
        }

        public async Task<Todo> GetAsync(int id)
        {
            return await _context.Todos.SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Todo>> ListAsync()
        {
            return await _context.Todos.ToListAsync();
        }

        public async Task<bool> UpdateAsync(Todo todo)
        {
            _context.Todos.Update(todo);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<Todo> FindSingleOrDefault(Expression<Func<Todo, bool>> predicate)
        {
            return await _context.Todos.Where(predicate).SingleOrDefaultAsync();
        }
    }
}