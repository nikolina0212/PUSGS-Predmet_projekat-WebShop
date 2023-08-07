using Backend.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IArticleService
    {
        Task<List<ArticleDto>> GetAllArticles();
        Task<ArticleDto> GetArticle(long articleId);
        Task<List<ArticleDto>> GetSellerArticles(long sellerId);
        Task<ArticleDto> AddArticle(long sellerId, AddArticleDto newArticle);
        Task<ArticleDto> UpdateArticle(ArticleDto article);
        Task DeleteArticle(long articleId, long sellerId);

    }
}
