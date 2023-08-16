using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Repositories.Abstractions
{
    public interface IArticleRepository : IRepository<Article>
    {
        Task<Article> FindArticle(long articleId);
        Task<bool> CheckSellerFee(long purchaserId, long sellerId);
    }
}
