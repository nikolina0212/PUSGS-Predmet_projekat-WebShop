namespace Backend.Models
{
    public class OrderArticle
    {
        public Order Order { get; set; }
        public long OrderId { get; set; }
        public Article Article{ get; set; }
        public long ArticleId { get; set; }
        public int AmountOfArticle { get; set; }
        public bool Accepted { get; set; }
    }
}
