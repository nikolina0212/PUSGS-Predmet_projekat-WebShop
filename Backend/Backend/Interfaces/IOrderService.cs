using Backend.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IOrderService
    {
        Task ConfirmOrder(long orderId, ConfirmOrderDto confirmOrderDto);
        Task CancelOrder(long orderId);
        Task<List<OrderListExt>> AllOrders();
        Task<List<OrderListDto>> PurchaserOrders(long purchaserId);
        Task<List<OrderListExt>> SellerOrders(long sellerId, bool isNew);
        Task<List<OrderInfoDto>> OrderDetails(long orderId);
        Task<List<OrderInfoDto>> SellerOrderDetails(long orderId, long sellerId);
        Task<List<OrderMapDto>> OrdersOnMap(long orderId);
        Task<int> AcceptOrderOnMap(long sellerId, long orderId);
    }
}
