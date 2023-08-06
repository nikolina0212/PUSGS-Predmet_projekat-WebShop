using Backend.DTO;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        Task<TokenDto> SignUpUser(UserSignUpDto signUpUser);
        Task<TokenDto> LoginUser(UserLoginDto loginUser);
        Task<UserProfileInfoDto> GetProfile(long userId);
        Task<UserProfileInfoDto> UpdateProfile(long userId, UpdateProfileDto newProfile);
        Task ChangePassword(long id, PasswordDto newPassword);
    }
}
