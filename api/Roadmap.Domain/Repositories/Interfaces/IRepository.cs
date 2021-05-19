using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Roadmap.Domain.Repositories.Interfaces
{
    public interface IRepository<T>
    {
        Task<int> AddAsync(T t);

        Task<bool> DeleteAsync(int id);

        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        Task<T> GetAsync(int id);

        Task<IEnumerable<T>> ListAsync();

        Task<bool> UpdateAsync(T t);
    }
}