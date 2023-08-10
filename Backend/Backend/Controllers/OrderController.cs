using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using System.IO;
using Backend.DTO;

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
    }
}
