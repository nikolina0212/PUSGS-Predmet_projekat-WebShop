using Backend.Infrastructure;
using Backend.Models;
using Backend.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class ArticleRepository : GenericRepository<Article>, IArticleRepository
    {
        public ArticleRepository(PusgsDBContext dbContext) : base(dbContext)
        {
        }

       public async Task<Article> FindArticle(long articleId)
       {
         var article = await _dbContext.Articles
          .Include(o => o.Seller)
            .FirstOrDefaultAsync(o => o.Id == articleId);
           return article;
       }

        public async Task<bool> CheckSellerFee(long orderId, long sellerId)
        {
            List<OrderArticle> orderArticles = await _dbContext.OrderArticles
                .Include(o => o.Order)
             .Include(o => o.Article)
             .ThenInclude(o => o.Seller)
               .Where(o => o.Order.Id == orderId).ToListAsync();

            foreach(var oa in orderArticles)
            {
                if(oa.Article.Seller.Id == sellerId)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
