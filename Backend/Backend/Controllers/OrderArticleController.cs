using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using Backend.Shared;
using System.IO;

namespace Backend.Controllers
{
    [Route("api/order-articles")]
    [ApiController]
    public class OrderArticleController : ControllerBase
    {
        private readonly IOrderArticleService _orderArticleService;
        public OrderArticleController(IOrderArticleService orderArticleService)
        {
            _orderArticleService = orderArticleService;
        }

        [HttpPost("{articleId}/{articleAmount}")]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> AddToCart([FromRoute] long articleId, [FromRoute] string articleAmount)
        {
            long purchaserId = long.Parse(User.GetUserId());
            try
            {
                await _orderArticleService.AddOrderArticle(purchaserId, articleId, articleAmount);
                return Ok("Article successfully added.");

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> GetOrderArticles()
        {
            long userId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _orderArticleService.GetOrderArticles(userId));

            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{articleId}/{orderId}")]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> DeleteOrderItem([FromRoute] long articleId, [FromRoute] long orderId)
        {
            try
            {
                await _orderArticleService.DeleteOrderArticle(articleId, orderId);
                return Ok();
            }
            catch (InvalidDataException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
