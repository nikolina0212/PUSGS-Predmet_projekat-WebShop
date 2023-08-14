using Backend.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        Task<TokenDto> SignUpUser(UserSignUpDto signUpUser);
        Task<TokenDto> SignInWithGoogle(GoogleDto googleDto);
        Task<TokenDto> LoginUser(UserLoginDto loginUser);
        Task<UserProfileInfoDto> GetProfile(long userId);
        Task<UserProfileInfoDto> UpdateProfile(long userId, UpdateProfileDto newProfile);
        Task ChangePassword(long id, PasswordDto newPassword);
        Task<List<UserInfoDto>> GetUsers();
        Task AcceptSeller(long sellerId);
        Task RejectSeller(long sellerId);
    }
}
