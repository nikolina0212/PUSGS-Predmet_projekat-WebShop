using AutoMapper;
using Backend.DTO;
using Backend.Interfaces;
using Backend.Models.Enums;
using Backend.Repositories;
using Backend.Repositories.Abstractions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

        public async Task<List<OrderListExt>> AllOrders()
        {
            var orders = await _unitOfWork.Orders.GetAllOrders();
            if (orders.Any())
            {
                List<OrderListExt> orderListAdminDtos = new();
                foreach (var or in orders)
                {
                    await _unitOfWork.Orders.CheckStatus(or);
                    var order = _mapper.Map<OrderListExt>(or);
                    order.Purchaser = or.Purchaser.FirstName + " " + or.Purchaser.LastName;
                    order.PurchaserImage = or.Purchaser.Image;
                    orderListAdminDtos.Add(order);
                }

                return _mapper.Map<List<OrderListExt>>(orderListAdminDtos);
            }

            throw new InvalidOperationException("No orders.");
        }

        public async Task<List<OrderListDto>> PurchaserOrders(long purchaserId)
        {
            var orders = await _unitOfWork.Orders.SelectAll(x => x.PurchaserId == purchaserId &&
            (x.OrderStatus.Equals(OrderStatus.Delivering) || x.OrderStatus.Equals(OrderStatus.Delivered)));
            if (orders.Any())
            {
                foreach (var order in orders)
                {
                    await _unitOfWork.Orders.CheckStatus(order);
                }
                return _mapper.Map<List<OrderListDto>>(orders);
            }

            throw new InvalidOperationException("No orders yet.");
        }

        public async Task<List<OrderListExt>> SellerOrders(long sellerId, bool isNew)
        {
            var orders = await _unitOfWork.Orders.GetSellerOrders(sellerId);

            if (orders.Any())
            {
                foreach (var order in orders)
                {
                    await _unitOfWork.Orders.CheckStatus(order);
                }

                var filteredOrders = isNew ? orders.Where(o => o.OrderStatus.Equals(OrderStatus.Delivering))
                    : orders.Where(o => o.OrderStatus.Equals(OrderStatus.Delivered));

                if (filteredOrders.Any())
                {
                    List<OrderListExt> orderListExts = new();
                    foreach (var or in filteredOrders)
                    {
                        var order = _mapper.Map<OrderListExt>(or);
                        order.Purchaser = or.Purchaser.FirstName + " " + or.Purchaser.LastName;
                        order.PurchaserImage = or.Purchaser.Image;
                        orderListExts.Add(order);
                    }

                    return orderListExts;
                }
                else
                {
                    throw new InvalidOperationException("No orders.");
                }
            }

            throw new InvalidOperationException("No orders.");
        }

        public async Task<List<OrderInfoDto>> OrderDetails(long orderId)
        {
            var order = await _unitOfWork.Orders.OrderDetails(orderId) ??
                throw new InvalidDataException("Error - No order.");

            List<OrderInfoDto> orderInfoDtos = new();

            foreach (var orderArticle in order.OrderArticles)
            {
                var article = _mapper.Map<OrderInfoDto>(orderArticle.Article);
                article.AmountOfArticle = orderArticle.AmountOfArticle;
                article.SellerName = orderArticle.Article.Seller.FirstName + " " + orderArticle.Article.Seller.LastName;
                orderInfoDtos.Add(article);
            }

            return orderInfoDtos;
        }

        public async Task<List<OrderInfoDto>> SellerOrderDetails(long orderId, long sellerId)
        {
            var order = await _unitOfWork.Orders.OrderDetails(orderId) ??
                throw new InvalidDataException("Error - No order.");

            List<OrderInfoDto> orderInfoDtos = new();

            foreach (var orderArticle in order.OrderArticles)
            {
                if (orderArticle.Article.SellerId == sellerId)
                {
                    var article = _mapper.Map<OrderInfoDto>(orderArticle.Article);
                    article.AmountOfArticle = orderArticle.AmountOfArticle;
                    orderInfoDtos.Add(article);
                }
            }

            return orderInfoDtos;
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
