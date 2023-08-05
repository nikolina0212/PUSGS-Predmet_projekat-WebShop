using System.Collections.Generic;
using System;
using Backend.Models.Enums;

namespace Backend.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Image { get; set; }
        public UserTypes UserType { get; set; }
        public List<Order> Orders { get; set; }
        public List<Article> Articles { get; set; }
    }
}
