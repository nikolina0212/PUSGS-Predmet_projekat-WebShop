using System.Collections.Generic;
using System;
using Backend.Models.Enums;

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
        public OrderStatus OrderStatus { get; set; }
        public double TotalPrice { get; set; }
        public double TotalFee { get; set; }
    }
}
