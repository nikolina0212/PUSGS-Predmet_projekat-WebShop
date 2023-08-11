using Backend.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IOrderService
    {
        Task ConfirmOrder(long orderId, ConfirmOrderDto confirmOrderDto);
        Task DeleteOrder(long orderId);
        Task CancelOrder(long orderId);
        Task<List<OrderListExt>> AllOrders();
        Task<List<OrderListDto>> PurchaserOrders(long purchaserId);
        Task<List<OrderListExt>> SellerOrders(long sellerId, bool isNew);
        Task<List<OrderInfoDto>> OrderDetails(long orderId);
        Task<List<OrderInfoDto>> SellerOrderDetails(long orderId, long sellerId);
    }
}
