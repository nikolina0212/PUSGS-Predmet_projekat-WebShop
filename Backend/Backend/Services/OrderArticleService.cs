using AutoMapper;
using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
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
    public class OrderArticleService : IOrderArticleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public OrderArticleService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task AddOrderArticle(long purchaserId, long articleId, int articleAmount)
        {
            var article = await _unitOfWork.Articles.GetById(articleId);

            if (articleAmount >= 0 && article.Amount == 0)
            {
                throw new InvalidOperationException("Error while trying to add item. No enough quantity left.");
            }
            if (article.Amount > 0 && articleAmount == 0)
            {
                throw new InvalidOperationException("Quantity must be greater then 0.");
            }

            Order currentOrder = await _unitOfWork.Orders.Select(x => x.OrderStatus.Equals(OrderStatus.InProgress)
                                                                    && x.PurchaserId == purchaserId);

            if (currentOrder == null)
            {
                currentOrder = new Order { PurchaserId = purchaserId, OrderStatus = OrderStatus.InProgress};
                await _unitOfWork.Orders.Create(currentOrder);
                await _unitOfWork.SaveChangesAsync();
            }

            var exsistingOrderArticle = await _unitOfWork.OrderArticles.Select(x => x.ArticleId == articleId 
                                                       && x.OrderId == currentOrder.Id);
            if (exsistingOrderArticle == null)
            {
                await _unitOfWork.OrderArticles.Create
                    (new OrderArticle { ArticleId = articleId, OrderId = currentOrder.Id, AmountOfArticle = articleAmount });
            }
            else
            {
                exsistingOrderArticle.AmountOfArticle += articleAmount;
            }

            article.Amount -= articleAmount;
            currentOrder.TotalPrice += (article.Price * articleAmount);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteOrderArticle(long articleId, long orderId)
        {
            var orderArticle = await _unitOfWork.OrderArticles.GetById(orderId, articleId) 
                ?? throw new InvalidDataException("Error - Order article does not exists.");

            var order = await _unitOfWork.Orders.GetById(orderId) ??
                throw new InvalidDataException("Error - Order does not exists.");
            

            var article = await _unitOfWork.Articles.GetById(articleId);
            article.Amount += orderArticle.AmountOfArticle;
            order.TotalPrice -= (article.Price * orderArticle.AmountOfArticle);

            _unitOfWork.OrderArticles.Delete(orderArticle);
            await _unitOfWork.SaveChangesAsync();

            var remaining = await _unitOfWork.OrderArticles.SelectAll(x => x.OrderId == orderId);
            if (!remaining.Any())
            {
                _unitOfWork.Orders.Delete(order);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task<List<OrderArticleDto>> GetOrderArticles(long purchaserId)
        {
            var currentOrder = await _unitOfWork.Orders.GetArticlesInOrder(purchaserId) ??
                throw new InvalidOperationException("You don't have any active orders yet.");
           
            List<OrderArticleDto> orderArticleDtos = new();
            foreach (var orderArticle in currentOrder.OrderArticles)
            {
                 var totalOrderArticlePrice = orderArticle.Article.Price * orderArticle.AmountOfArticle;
                 orderArticleDtos.Add(new OrderArticleDto
                 {
                      ArticleName = orderArticle.Article.Name,
                      ArticlePrice = totalOrderArticlePrice,
                      ArticleQuantity = orderArticle.AmountOfArticle,
                      OrderId = orderArticle.OrderId,
                      ArticleId = orderArticle.ArticleId,
                      TotalPrice = currentOrder.TotalPrice,
                      ArticleImage = orderArticle.Article.Image
                 });
            }

            return orderArticleDtos;
        }
    }
}
