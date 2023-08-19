using System;

namespace Backend.DTO
{
    public class OrderMapDto
    {
        public long Id { get; set; }
        public string Comment { get; set; }
        public string ShippingAddress { get; set; }
        public DateTime OrderPlacementTime { get; set; }
        public double TotalPrice { get; set; }
    }
}
