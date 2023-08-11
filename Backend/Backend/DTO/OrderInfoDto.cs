namespace Backend.DTO
{
    public class OrderInfoDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int AmountOfArticle { get; set; }
        public double Price { get; set; }
        public string SellerName { get; set; }
        public string Image { get; set; }
    }
}
