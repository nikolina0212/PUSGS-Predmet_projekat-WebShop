using Backend.Infrastructure;
using Backend.Repositories.Abstractions;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PusgsDBContext _dbContext;

        public UnitOfWork(PusgsDBContext dbContext)
        {
            _dbContext = dbContext;
            Users = new UserRepository(_dbContext);
            Articles = new ArticleRepository(_dbContext);
            Orders = new OrderRepository(_dbContext);
            OrderArticles = new OrderArticleRepository(_dbContext);
        }

        public UserRepository Users { get; private set; }
        public ArticleRepository Articles { get; private set; }
        public OrderRepository Orders { get; private set; }
        public OrderArticleRepository OrderArticles { get; private set; }


        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }

}
