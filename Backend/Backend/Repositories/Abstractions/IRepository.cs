using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System;

namespace Backend.Repositories.Abstractions
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<TEntity> GetById(params object[] keys);
        Task<IEnumerable<TEntity>> GetAll();
        Task Create(TEntity entity);
        void Delete(TEntity entity);

        Task<TEntity> Select(Expression<Func<TEntity, bool>> predicate);
        Task<IEnumerable<TEntity>> SelectAll(Expression<Func<TEntity, bool>> predicate);
    }
}
