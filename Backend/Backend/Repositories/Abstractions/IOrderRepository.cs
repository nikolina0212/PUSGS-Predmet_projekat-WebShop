using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Repositories.Abstractions
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order> GetArticlesInOrder(long purchaserId);
        Task<Order> OrderToDelete(long orderId);
    }
}
