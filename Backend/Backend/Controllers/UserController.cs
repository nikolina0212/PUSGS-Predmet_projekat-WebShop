using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System;
using Backend.DTO;
using Microsoft.AspNetCore.Authorization;
using Backend.Shared;

namespace Backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUpUser([FromForm] UserSignUpDto signupUser)
        {
            try
            {
                return Ok(await _userService.SignUpUser(signupUser));

            }
            catch (InvalidDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] UserLoginDto loginUser)
        {
            try
            {
                return Ok(await _userService.LoginUser(loginUser));
            }
            catch (InvalidDataException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong.");
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            long userId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _userService.GetProfile(userId));
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong.");
            }
        }

        [HttpPut("change-profile")]
        [Authorize]
        public async Task<IActionResult> ChangeUserProfile([FromForm] UpdateProfileDto updateProfileDto)
        {
            long userId = long.Parse(User.GetUserId());
            try
            {
                return Ok(await _userService.UpdateProfile(userId, updateProfileDto));

            }
            catch (InvalidDataException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("Something went wrong.");
            }
        }

        [HttpPatch("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(PasswordDto passwordDto)
        {
            long userId = long.Parse(User.GetUserId());
            try
            {
                await _userService.ChangePassword(userId, passwordDto);
                return Ok("Password successfully changed.");
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
    }
}
