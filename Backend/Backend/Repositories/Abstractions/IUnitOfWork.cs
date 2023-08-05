using System.Threading.Tasks;
using System;

namespace Backend.Repositories.Abstractions
{
    public interface IUnitOfWork : IDisposable
    {
        UserRepository Users { get; }
        ArticleRepository Articles { get; }
        OrderRepository Orders { get; }
        OrderArticleRepository OrderArticles { get; }

        Task SaveChangesAsync();
    }
}
