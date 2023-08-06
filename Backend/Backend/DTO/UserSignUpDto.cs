using Backend.Models.Enums;
using Microsoft.AspNetCore.Http;
using System;

namespace Backend.DTO
{
    public class UserSignUpDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public IFormFile Image { get; set; }
        public UserTypes UserType { get; set; }
    }
}
