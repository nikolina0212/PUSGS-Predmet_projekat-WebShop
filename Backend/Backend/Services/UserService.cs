using AutoMapper;
using Backend.DTO;
using Backend.Interfaces;
using Backend.Models.Enums;
using Backend.Models;
using Backend.Repositories.Abstractions;
using System.IO;
using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _emailConfig;

        public UserService(IMapper mapper, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _secretKey = configuration.GetSection("SecretKey");
            _emailConfig = configuration.GetSection("EmailConfig");
        }

        public async Task<TokenDto> SignUpUser(UserSignUpDto signupUser)
        {
            if (EmailValidation(signupUser.Email))
            {
                User user = await _unitOfWork.Users.Select(x => x.Email.Equals(signupUser.Email));
                if (user == null)
                {
                    user = _mapper.Map<User>(signupUser);
                    if (!signupUser.UserType.Equals(UserTypes.Seller))
                    {
                        user.Verified = true;
                    }

                    user.Password = BCrypt.Net.BCrypt.HashPassword(signupUser.Password);
                    await _unitOfWork.Users.Create(user);
                    await _unitOfWork.SaveChangesAsync();


                    return new TokenDto { Token = CreateToken(user.Id, user.UserType, user.Verified) };
                }
                else
                {
                    throw new Exception("Error - User with that email already exists.");
                }
            }
            else
            {
                throw new InvalidDataException("Error - Not correct format of email.");
            }
        }
        public async Task<TokenDto> LoginUser(UserLoginDto loginUser)
        {
            User user = await _unitOfWork.Users.Select(x => x.Email.Equals(loginUser.Email));
            if (EmailValidation(loginUser.Email))
            {
                if (user == null)
                {
                    throw new InvalidDataException("Error - User with that email doesn't exist");
                }
                else if (!BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
                {
                    throw new InvalidDataException("Error - Incorrect password.");
                }

                return new TokenDto { Token = CreateToken(user.Id, user.UserType, user.Verified) };
            }
            else
            {
                throw new InvalidDataException("Error - Not correct format of email.");
            }
        }


        public async Task<UserProfileInfoDto> GetProfile(long userId)
        {
            var user = await _unitOfWork.Users.GetById(userId);
            return user == null  
                ? throw new InvalidDataException("Error - User does not exists.") 
                : _mapper.Map<UserProfileInfoDto>(user);
        }

        public async Task<UserProfileInfoDto> UpdateProfile(long userId, UpdateProfileDto newProfile)
        {
            User user = await _unitOfWork.Users.GetById(userId);
            if (user == null)
            {
                throw new InvalidDataException("Error - User does not exists.");
            }
            else
            {
                user.Username = newProfile.Username;
                user.FirstName = newProfile.FirstName;
                user.LastName = newProfile.LastName;
                user.Address = newProfile.Address;
                user.DateOfBirth = newProfile.DateOfBirth;

                await _unitOfWork.SaveChangesAsync();
                return _mapper.Map<UserProfileInfoDto>(user);
            }
        }

        public async Task ChangePassword(long id, PasswordDto newPassword)
        {
            var user = await _unitOfWork.Users.GetById(id);
            if (user == null)
                throw new InvalidDataException("Error - User does not exists.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword.NewPassword);
            await _unitOfWork.SaveChangesAsync();
        }

        #region pomocne funkcije

        public static bool EmailValidation(string email)
        {
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

            Regex regex = new(pattern);

            return regex.IsMatch(email);
        }

        public string CreateToken(long id, UserTypes userType, bool verified)
        {
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Role, userType.ToString()),
                new Claim("id", id.ToString()),
                new Claim("verified", verified.ToString())
            };

            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "https://localhost:44320",
                claims: claims,
                expires: DateTime.Now.AddMinutes(40),
                signingCredentials: signinCredentials
            );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return token;
        }

        public async Task SendMail(string reciever, string subject, string body)
        {
            var message = new MimeMessage();

            var host = _emailConfig.GetValue<string>("Host");
            var username = _emailConfig.GetValue<string>("Username");
            var password = _emailConfig.GetValue<string>("Password");

            message.From.Add(MailboxAddress.Parse(username));
            message.To.Add(MailboxAddress.Parse(reciever));
            message.Subject = subject;

            message.Body = new TextPart(TextFormat.Plain)
            {
                Text = body
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(host, 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(username, password);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }

        #endregion
    }
}
