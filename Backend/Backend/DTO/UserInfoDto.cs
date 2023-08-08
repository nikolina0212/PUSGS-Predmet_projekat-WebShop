using Backend.Models.Enums;

namespace Backend.DTO
{
    public class UserInfoDto
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUri { get; set; }
        public bool Verified { get; set; }
        public VerificationStatus VerificationStatus { get; set; }
        public UserTypes UserType { get; set; }
    }
}
