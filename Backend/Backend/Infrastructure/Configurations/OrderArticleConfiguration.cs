using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Infrastructure.Configurations
{
    public class OrderArticleConfiguration : IEntityTypeConfiguration<OrderArticle>
    {
        public void Configure(EntityTypeBuilder<OrderArticle> builder)
        {
            builder.HasKey(x => new { x.OrderId, x.ArticleId }); 

            builder.HasOne(x => x.Order)
               .WithMany(x => x.OrderArticles)
               .HasForeignKey(x => x.OrderId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Article)
               .WithMany(x => x.OrderArticles)
               .HasForeignKey(x => x.ArticleId)
               .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
