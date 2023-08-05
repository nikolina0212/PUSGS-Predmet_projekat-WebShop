using System.Collections.Generic;

namespace Backend.Models
{
    public class Article
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public List<OrderArticle> OrderArticles { get; set; }
        public User Seller { get; set; }
        public long SellerId { get; set; }
    }
}
