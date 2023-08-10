namespace Backend.DTO
{
    public class OrderArticleDto
    {
        public long OrderId { get; set; }
        public long ArticleId { get; set; }
        public string ArticleImage { get; set; }
        public string ArticleName { get; set; }
        public int ArticleQuantity { get; set; }
        public double ArticlePrice { get; set; }
        public double TotalPrice { get; set; }
        public double Fee { get; set; }
    }
}
