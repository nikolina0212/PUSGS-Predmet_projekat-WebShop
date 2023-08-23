using Backend.Infrastructure;
using Backend.Models;
using Backend.Models.Enums;
using Backend.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(PusgsDBContext dbContext) : base(dbContext)
        {
        }

        public async Task CheckStatus(Order order)
        {
            if (order.EstimatedDeliveryDate < DateTime.Now && order.OrderStatus == OrderStatus.Delivering)
            {
                order.OrderStatus = OrderStatus.Delivered;
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Order>> GetAllOrders()
        {
            var orders = await _dbContext.Orders.Where(o => o.OrderStatus.Equals(OrderStatus.Delivering)
                         || o.OrderStatus.Equals(OrderStatus.Delivered) || o.OrderStatus.Equals(OrderStatus.Canceled)).
                Include(o => o.Purchaser).ToListAsync();
            return orders;
        }

        public async Task<Order> GetArticlesInOrder(long purchaserId)
        {
            var order = await _dbContext.Orders
            .Include(o => o.OrderArticles)
                .ThenInclude(oi => oi.Article)
                .ThenInclude(i => i.Seller)
            .FirstOrDefaultAsync(o => o.PurchaserId == purchaserId && o.OrderStatus == OrderStatus.InProgress);

            return order;
        }

        public async Task<List<Order>> GetSellerOrders(long sellerId)
        {
            var orders = await _dbContext.Orders
                .Where(o => o.OrderStatus.Equals(OrderStatus.Delivering) || 
                            o.OrderStatus.Equals(OrderStatus.Delivered))
                .Include(o => o.OrderArticles)
                    .ThenInclude(oi => oi.Article)
                .Include(o => o.Purchaser)
                .Where(o => o.OrderArticles.Any(oi => oi.Article.SellerId == sellerId))
                .ToListAsync();

            return orders;
        }

        public async Task<Order> OrderDetails(long orderId)
        {
            var order = await _dbContext.Orders.Include(o => o.OrderArticles).
                ThenInclude(oi => oi.Article).ThenInclude(i => i.Seller).
                FirstOrDefaultAsync(o => o.Id == orderId);

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

        public async Task<List<Order>> GetOrdersOnMap(long sellerId)
        {
            var orders = await _dbContext.Orders
                .Where(o => o.OrderStatus == OrderStatus.Pending)
                .Include(o => o.OrderArticles)
                    .ThenInclude(oi => oi.Article)
                .Include(o => o.Purchaser)
                .Where(o => o.OrderArticles.Any(oi => oi.Article.SellerId == sellerId))
                .ToListAsync();

            return orders;
        }
    }
}
