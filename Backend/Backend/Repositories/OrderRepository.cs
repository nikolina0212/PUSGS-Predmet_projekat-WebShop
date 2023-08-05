using Backend.Infrastructure;
using Backend.Models;

namespace Backend.Repositories
{
    public class OrderRepository : GenericRepository<Order>
    {
        public OrderRepository(PusgsDBContext dbContext) : base(dbContext)
        {
        }
    }
}
