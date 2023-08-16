using Backend.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IOrderArticleService
    {
        Task AddOrderArticle(long purchaserId, long articleId, string articleAmount);
        Task<List<OrderArticleDto>> GetOrderArticles(long purchaserId);
        Task DeleteOrderArticle(long purchaserId, long articleId, long orderId);
    }
}
