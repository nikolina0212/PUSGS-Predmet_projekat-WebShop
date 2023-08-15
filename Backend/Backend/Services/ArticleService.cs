using AutoMapper;
using Backend.DTO;
using Backend.Interfaces;
using Backend.Models;
using Backend.Repositories;
using Backend.Repositories.Abstractions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ArticleService(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<List<ArticleDto>> GetAllArticles()
        {
            var articles = await _unitOfWork.Articles.GetAll();
            return articles.Any() ? _mapper.Map<List<ArticleDto>>(articles)
                : throw new InvalidOperationException("No available articles.");
        }

        public async Task<ArticleDto> GetArticle(long articleId)
        {
            var article = await _unitOfWork.Articles.GetById(articleId);
            return article == null ? throw new InvalidDataException("Article does not exists.") 
                : _mapper.Map<ArticleDto>(article);
        }

        public async Task<List<ArticleDto>> GetSellerArticles(long sellerId)
        {
            var articles = await _unitOfWork.Articles.SelectAll(x => x.SellerId == sellerId);
            return articles.Any() ? _mapper.Map<List<ArticleDto>>(articles) 
                : throw new InvalidOperationException("No articles.");
        }

        public async Task<ArticleDto> AddArticle(long sellerId, AddArticleDto newArticle)
        {
            var seller = await _unitOfWork.Users.GetById(sellerId);
            if (seller == null || !seller.Verified)
            {
                throw new InvalidDataException("Seller does not exists or cannot adding articles.");
            }
            else
            {
                if (int.TryParse(newArticle.Amount.ToString(), out int amount) &&
                    double.TryParse(newArticle.Price.ToString(), out double price))
                {
                    newArticle.Amount = amount;
                    newArticle.Price = price;
                    if (newArticle.Amount > 0 && newArticle.Price > 0)
                    {
                        Article article = _mapper.Map<Article>(newArticle);
                        article.SellerId = sellerId;

                        await _unitOfWork.Articles.Create(article);
                        await _unitOfWork.SaveChangesAsync();

                        if (newArticle.Image != null && newArticle.Image.Length > 0)
                        {
                            string fileName = "article" + Guid.NewGuid().ToString() + Path.GetExtension(newArticle.Image.FileName);
                            _ = await SaveImage(fileName, newArticle.Image,
                                Path.Combine(_webHostEnvironment.WebRootPath, "Images"));

                            article.Image = Path.Combine("Images", fileName);
                        }
                        else
                        {
                            string defaultImagePath = Path.Combine("Images", "default-article.png");
                            article.Image = defaultImagePath;
                        }

                        await _unitOfWork.SaveChangesAsync();
                        return _mapper.Map<ArticleDto>(article);
                    }
                    else
                    {
                        throw new InvalidDataException("Amount and price cannot be zero.");
                    }
                }
                else
                {
                    throw new InvalidDataException("Amount and price must be numbers.");
                }
            }
        }

        public async Task<ArticleDto> UpdateArticle(UpdateArticleDto article)
        {
            var updatingArticle = await _unitOfWork.Articles.GetById(article.Id);
            if (updatingArticle == null)
            {
                throw new InvalidDataException("Article does not exists.");
            }
            else
            {
                if (int.TryParse(article.Amount.ToString(), out int amount) &&
                    double.TryParse(article.Price.ToString(), out double price))
                {
                    if (amount > 0 && price > 0)
                    {
                        if (article.Image != null && article.Image.Length > 0)
                        {
                            string fileName = "article" + Guid.NewGuid().ToString() + Path.GetExtension(article.Image.FileName);
                            _ = await SaveImage(fileName, article.Image,
                                Path.Combine(_webHostEnvironment.WebRootPath, "Images"));

                            updatingArticle.Image = Path.Combine("Images", fileName);
                        }

                        updatingArticle.Name = article.Name;
                        updatingArticle.Price = price;
                        updatingArticle.Amount = amount;
                        updatingArticle.Description = article.Description;

                        await _unitOfWork.SaveChangesAsync();
                        return _mapper.Map<ArticleDto>(updatingArticle);
                    }
                    else
                    {
                        throw new InvalidDataException("Amount and price cannot be zero.");
                    }
                }
                else
                {
                    throw new InvalidDataException("Amount and price must be numbers.");
                }

            }
        }
        public async Task DeleteArticle(long articleId, long sellerId)
        {
            var article = await _unitOfWork.Articles.Select(x => x.Id == articleId && x.SellerId == sellerId)
                ?? throw new InvalidDataException("Article does not exists.");
            _unitOfWork.Articles.Delete(article);
            await _unitOfWork.SaveChangesAsync();
        }

        #region pomocne funkcije
        public static async Task<string> SaveImage(string fileName, IFormFile imageFile, string targetFolderPath)
        {
            string filePath = Path.Combine(targetFolderPath, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return filePath;
        }

        #endregion

    }
}
