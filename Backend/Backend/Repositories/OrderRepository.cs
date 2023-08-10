using Backend.Infrastructure;
using Backend.Models;
using Backend.Models.Enums;
using Backend.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(PusgsDBContext dbContext) : base(dbContext)
        {
        }

        public async Task<Order> GetArticlesInOrder(long purchaserId)
        {
            var order = await _dbContext.Orders
            .Include(o => o.OrderArticles)
                .ThenInclude(oi => oi.Article)
            .FirstOrDefaultAsync(o => o.PurchaserId == purchaserId && o.OrderStatus == OrderStatus.InProgress);

            return order;
        }

        public async Task<Order> OrderToDelete(long orderId)
        {
            var order = await _dbContext.Orders
            .Include(o => o.OrderArticles)
                .ThenInclude(oi => oi.Article)
            .FirstOrDefaultAsync(o => o.Id == orderId);

            return order;
        }
    }
}
