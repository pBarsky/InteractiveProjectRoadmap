using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Roadmap.Domain.Models;

namespace Roadmap.Domain.Repositories.Interfaces
{
    public interface ITodoRepository : IRepository<Todo>
    {
        Task<Todo> FindSingleOrDefault(Expression<Func<Todo, bool>> predicate);
    }
}