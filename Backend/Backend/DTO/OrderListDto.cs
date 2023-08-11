using Backend.Models.Enums;
using System;

namespace Backend.DTO
{
    public class OrderListDto
    {
        public long Id { get; set; }
        public string ShippingAddress { get; set; }
        public string Comment { get; set; }
        public DateTime EstimatedDeliveryDate { get; set; }
        public DateTime OrderPlacementTime { get; set; }
        public double TotalPrice { get; set; }
        public OrderStatus OrderStatus { get; set; }
    }
}
