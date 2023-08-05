using System.Collections.Generic;
using System;

namespace Backend.Models
{
    public class Order
    {
        public long Id { get; set; }
        public string ShippingAddress { get; set; }
        public string Comment { get; set; }
        public DateTime EstimatedDeliveryDate { get; set; }
        public DateTime OrderPlacementTime { get; set; }
        public List<OrderArticle> OrderArticles { get; set; }
        public User Purchaser { get; set; }
        public long PurchaserId { get; set; }
    }
}
