using Backend.Infrastructure;
using Backend.Models;

namespace Backend.Repositories
{
    public class UserRepository : GenericRepository<User>
    {
        public UserRepository(PusgsDBContext dbContext) : base(dbContext)
        {
        }
    }
}
