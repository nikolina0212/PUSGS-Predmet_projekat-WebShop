using Backend.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IOrderArticleService
    {
        Task AddOrderArticle(long purchaserId, long articleId, int articleAmount);
        Task<List<OrderArticleDto>> GetOrderArticles(long purchaserId);
        Task DeleteOrderArticle(long articleId, long orderId);
    }
}
