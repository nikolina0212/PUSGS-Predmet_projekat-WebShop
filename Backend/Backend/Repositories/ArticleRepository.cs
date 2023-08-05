using Backend.Infrastructure;
using Backend.Models;

namespace Backend.Repositories
{
    public class ArticleRepository : GenericRepository<Article>
    {
        public ArticleRepository(PusgsDBContext dbContext) : base(dbContext)
        {
        }
    }
}
