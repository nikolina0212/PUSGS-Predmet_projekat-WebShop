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
    }
}
