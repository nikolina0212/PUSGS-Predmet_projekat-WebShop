using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using System.IO;
using Backend.DTO;
using Backend.Shared;

namespace Backend.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpDelete("{orderId}")]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> DeleteOrder([FromRoute] long orderId)
        {
            try
            {
                await _orderService.DeleteOrder(orderId);
                return Ok();
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

        [HttpPatch("{orderId}/confirm")]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> ConfirmOrder([FromRoute] long orderId, [FromBody] ConfirmOrderDto confirmOrderDto)
        {
            try
            {
                await _orderService.ConfirmOrder(orderId, confirmOrderDto);
                return Ok("Order is successfully confirmed.");

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

        [HttpPatch("{orderId}/cancel")]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> CancelOrder([FromRoute] long orderId)
        {
            try
            {
                await _orderService.CancelOrder(orderId);
                return Ok("Order is successfully canceled.");
            }
            catch (InvalidDataException ex)
            {
                return NotFound(ex.Message);
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

        [HttpGet("purhcaser-orders")]
        [Authorize(Roles = "Purchaser")]
        public async Task<IActionResult> PurchaserOrders()
        {
            long purchaserId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _orderService.PurchaserOrders(purchaserId));

            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                return Ok(await _orderService.AllOrders());

            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("seller-orders")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerOrders([FromQuery] bool isNew)
        {
            long sellerId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _orderService.SellerOrders(sellerId, isNew));

            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{orderId}/details")]
        [Authorize(Roles = "Purchaser, Administrator")]
        public async Task<IActionResult> GetOrderDetails([FromRoute] long orderId)
        {
            try
            {
                return Ok(await _orderService.OrderDetails(orderId));

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

        [HttpGet("{orderId}/seller-details/")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetSellerOrderDetails([FromRoute] long orderId)
        {
            long sellerId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _orderService.SellerOrderDetails(orderId, sellerId));

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
