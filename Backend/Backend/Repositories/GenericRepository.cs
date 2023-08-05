using Backend.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System;
using System.Linq;
using Backend.Infrastructure;

namespace Backend.Repositories
{
    public class GenericRepository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly PusgsDBContext _dbContext;
        protected readonly DbSet<TEntity> _dbSet;

        public GenericRepository(PusgsDBContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<TEntity>();
        }
        public async Task<TEntity> GetById(params object[] keys)
        {
            TEntity entity = await _dbSet.FindAsync(keys);
            return entity;
        }

        public async Task<IEnumerable<TEntity>> GetAll()
        {
            IEnumerable<TEntity> entities = await _dbSet.ToListAsync();
            return entities;
        }

        public async Task Create(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Delete(TEntity entity) => _dbSet.Remove(entity);

        public async Task<TEntity> Select(Expression<Func<TEntity, bool>> predicate)
        {
            TEntity entity = await _dbSet.Where(predicate).FirstOrDefaultAsync();
            return entity;
        }

        public async Task<IEnumerable<TEntity>> SelectAll(Expression<Func<TEntity, bool>> predicate)
        {
            IEnumerable<TEntity> entities = await _dbSet.Where(predicate).ToListAsync();
            return entities;
        }
    }
}
