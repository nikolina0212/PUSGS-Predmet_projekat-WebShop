using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories.Abstractions
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order> GetArticlesInOrder(long purchaserId);
        Task<Order> OrderToDelete(long orderId);
        Task CheckStatus(Order order);
        Task<List<Order>> GetSellerOrders(long sellerId);
        Task<Order> OrderDetails(long orderId);
        Task<List<Order>> GetAllOrders();
        Task<List<Order>> GetOrdersOnMap(long sellerId);
    }
}
