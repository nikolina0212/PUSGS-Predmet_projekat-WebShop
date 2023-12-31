﻿using Backend.DTO;
using Backend.Models;
using AutoMapper;

namespace Backend.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // --- users ---
            CreateMap<User, UserSignUpDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserProfileInfoDto>().ReverseMap();
            CreateMap<User, UserInfoDto>().ReverseMap();

            // --- articles ---
            CreateMap<Article, ArticleDto>().ReverseMap();
            CreateMap<Article, AddArticleDto>().ReverseMap();
            CreateMap<Article, UpdateArticleDto>().ReverseMap();

            // --- orders ---
            CreateMap<Article, OrderInfoDto>().ReverseMap();
            CreateMap<Order, OrderListDto>().ReverseMap();
            CreateMap<Order, OrderListExt>().ReverseMap();
            CreateMap<Order, OrderMapDto>().ReverseMap();
        }
    }
}
