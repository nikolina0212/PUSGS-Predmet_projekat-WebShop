using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.IO;
using Backend.Shared;
using Backend.DTO;

namespace Backend.Controllers
{
    [Route("api/articles")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;
        public ArticleController(IArticleService articleService) { 
            _articleService = articleService;
        }

        [HttpGet("{articleId}")]
        [Authorize]
        public async Task<IActionResult> GetArticle([FromRoute] long articleId)
        {
            try
            {
                return Ok(await _articleService.GetArticle(articleId));
            }
            catch (InvalidDataException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> GetAllArticles()
        {
            try
            {
                return Ok(await _articleService.GetAllArticles());
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet("seller-articles")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerItems()
        {
            long sellerId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _articleService.GetSellerArticles(sellerId));
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> AddArticle([FromForm] AddArticleDto addArticleDto)
        {
            long sellerId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _articleService.AddArticle(sellerId, addArticleDto));
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> UpdateArticle([FromForm] UpdateArticleDto articleDto)
        {
            try
            {
                return Ok(await _articleService.UpdateArticle(articleDto));

            }
            catch (InvalidDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpDelete("{articleId}")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> DeleteArticle([FromRoute] string articleId)
        {
            long id = long.Parse(articleId);
            long sellerId = long.Parse(User.GetUserId());
            try
            {
                await _articleService.DeleteArticle(id, sellerId);
                return Ok();
            }
            catch (InvalidDataException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("Failed to delete item.");
            }
        }
    }
}
