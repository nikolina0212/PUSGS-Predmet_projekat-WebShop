using Backend.DTO;
using Backend.Models;
using AutoMapper;

namespace Backend.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserSignUpDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserProfileInfoDto>().ReverseMap();
        }
    }
}
