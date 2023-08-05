using Backend.Infrastructure;
using Backend.Models;

namespace Backend.Repositories
{
    public class OrderArticleRepository : GenericRepository<OrderArticle>
    {
        public OrderArticleRepository(PusgsDBContext dbContext) : base(dbContext)
        {
        }
    }
}
