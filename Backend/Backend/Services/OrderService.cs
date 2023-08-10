using AutoMapper;
using Backend.DTO;
using Backend.Interfaces;
using Backend.Models.Enums;
using Backend.Repositories;
using Backend.Repositories.Abstractions;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task ConfirmOrder(long orderId, ConfirmOrderDto confirmOrderDto)
        {
            var order = await _unitOfWork.Orders.GetById(orderId) ??
                throw new InvalidDataException("Error - Order does not exists.");

            order.ShippingAddress = confirmOrderDto.ShippingAddress;
            order.Comment = confirmOrderDto.Comment;
            order.OrderPlacementTime = DateTime.Now;
            order.EstimatedDeliveryDate = GenerateDeliveryTime();
            order.OrderStatus = OrderStatus.Delivering;

            await _unitOfWork.SaveChangesAsync();
        }
        public async Task CancelOrder(long orderId)
        {
            var order = await _unitOfWork.Orders.GetById(orderId) ??
                throw new InvalidDataException("Error - Order does not exists.");
           
            TimeSpan timeDifference = DateTime.Now.Subtract(order.OrderPlacementTime);

            if (timeDifference.TotalMinutes > 60)
            {
                throw new InvalidOperationException("You cannot cancel the order. " +
                    "The order can be canceled within the first hour of placing the order.");
            }

            order.OrderStatus = OrderStatus.Canceled;
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteOrder(long orderId)
        {
            var order = await _unitOfWork.Orders.OrderToDelete(orderId) ??
                throw new InvalidDataException("Error - Order does not exists.");

            foreach (var orderArticle in order.OrderArticles)
            {
                var item = await _unitOfWork.Articles.GetById(orderArticle.ArticleId) ??
                    throw new InvalidDataException("Error - Item does not exists.");
               
                item.Amount += orderArticle.AmountOfArticle;
            }

            _unitOfWork.Orders.Delete(order);
            await _unitOfWork.SaveChangesAsync();
        }

        #region pomocne funkcije
        public static DateTime GenerateDeliveryTime()
        {
            Random random = new();

            int additionalRandomMinutes = random.Next(1, 11); 

            TimeSpan totalOffset = new(0, additionalRandomMinutes, 0);

            DateTime randomTime = DateTime.Now.Add(totalOffset);

            return randomTime;
        }

        #endregion
    }
}
