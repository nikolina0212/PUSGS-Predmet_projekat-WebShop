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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Net.Http;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _emailConfig;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfigurationSection _googleClientId;
        public UserService(IMapper mapper, IUnitOfWork unitOfWork, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _secretKey = configuration.GetSection("SecretKey");
            _emailConfig = configuration.GetSection("EmailConfig");
            _webHostEnvironment = webHostEnvironment;
            _googleClientId = configuration.GetSection("GoogleClientID");
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
                        user.VerificationStatus = VerificationStatus.Finished;
                    }
                    else
                    {
                        Random random = new();
                        user.SellerFee = random.Next(200, 501);
                        user.VerificationStatus = VerificationStatus.Pending;
                    }

                    user.Password = BCrypt.Net.BCrypt.HashPassword(signupUser.Password);

                    if (signupUser.Image != null && signupUser.Image.Length > 0)
                    {
                        string imagePath = await SaveImage(signupUser.Image,
                            Path.Combine(_webHostEnvironment.WebRootPath, "Images"));

                        user.Image = imagePath;
                    }
                    else
                    {
                        string defaultImagePath = Path.Combine("Images", "default-user.png");
                        user.Image = defaultImagePath;
                    }

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
            User user = await _unitOfWork.Users.GetById(userId) ??
                throw new InvalidDataException("Error - User does not exists.");
            if (newProfile.Image != null && newProfile.Image.Length > 0)
            {
                    string imagePath = await SaveImage(newProfile.Image, 
                        Path.Combine(_webHostEnvironment.WebRootPath, "Images"));

                    user.Image = imagePath;
            }

            user.Username = newProfile.Username;
            user.FirstName = newProfile.FirstName;
            user.LastName = newProfile.LastName;
            user.Address = newProfile.Address;
            user.DateOfBirth = newProfile.DateOfBirth;

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<UserProfileInfoDto>(user);
        }

        public async Task ChangePassword(long id, PasswordDto newPassword)
        {
            var user = await _unitOfWork.Users.GetById(id);
            if (user == null)
                throw new InvalidDataException("Error - User does not exists.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword.NewPassword);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<List<UserInfoDto>> GetUsers()
        {
            var users = await _unitOfWork.Users.SelectAll(x => !x.UserType.Equals(UserTypes.Administrator));
            return users.Any()
                ? _mapper.Map<List<UserInfoDto>>(users)
                : throw new InvalidDataException("No users.");
        }

        public async Task AcceptSeller(long sellerId)
        {
            var seller = await _unitOfWork.Users.GetById(sellerId) ??
                throw new InvalidDataException("Seller does not exists.");

            seller.Verified = true;
            seller.VerificationStatus = VerificationStatus.Finished;
            await _unitOfWork.SaveChangesAsync();

            await SendMail(seller.Email, "Registration accepted", $"Hello {seller.FirstName}." +
                $" Administrator has accepted your registration request." +
                $" You can now start using all application functionalities.");
        }

        public async Task RejectSeller(long sellerId)
        {
            var seller = await _unitOfWork.Users.GetById(sellerId) ??
                throw new InvalidDataException("Seller does not exists.");

            seller.VerificationStatus = VerificationStatus.Finished;
            await _unitOfWork.SaveChangesAsync();

            await SendMail(seller.Email, "Registration rejected", $"Hello {seller.FirstName}." +
                $" Administrator has rejected your registration request.");
        }

        public async Task<TokenDto> SignInWithGoogle(GoogleDto googleDto)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(googleDto.GoogleToken);
            if (payload.Audience.ToString() != _googleClientId.Value)
            {
                throw new InvalidJwtException("Error - Invalid google token.");
            }

            User user = await _unitOfWork.Users.Select(x => x.Email.Equals(payload.Email));

            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    Username = payload.GivenName + "_" + payload.FamilyName,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    UserType = UserTypes.Purchaser,
                    DateOfBirth = new DateTime(2001, 01, 01),
                    Verified = true,
                    VerificationStatus = VerificationStatus.Finished
                };
                if (payload.Picture != null)
                {
                    string imageUrl = payload.Picture;
                    string targetFolderPath = Path.Combine("Images", "Users");

                    string result = await SaveGoogleImage(imageUrl, 
                        Path.Combine(_webHostEnvironment.WebRootPath, "Images"));
                    user.Image = result;
                }
                else
                {
                    string defaultImagePath = Path.Combine("Images", "default-user.png");
                    user.Image = defaultImagePath;
                }

                await _unitOfWork.Users.Create(user);
                await _unitOfWork.SaveChangesAsync();

                return new TokenDto { Token = CreateToken(user.Id, user.UserType, user.Verified) };
            }

            return new TokenDto { Token = CreateToken(user.Id, user.UserType, user.Verified) };
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

        public static async Task<string> SaveImage(IFormFile imageFile, string targetFolderPath)
        {
            string fileName = "user" + Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);

            string filePath = Path.Combine(targetFolderPath, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return filePath;
        }

        public async static Task<string> SaveGoogleImage(string imageUrl, string targetFolderPath)
        {
            string fileName = $"{Guid.NewGuid()}.jpg";

            string filePath = Path.Combine(targetFolderPath, fileName);

            using var httpClient = new HttpClient();
            try
            {
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);

                await File.WriteAllBytesAsync(filePath, imageBytes);

                return filePath;
            }
            catch (Exception ex)
            {
                throw new Exception("Error saving profile picture.", ex);
            }
        }


        #endregion
    }
}
