using System.Security.Claims;
using System;
using System.Linq;

namespace Backend.Utils
{
    public static class UserInformation
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            var result = user.Claims.FirstOrDefault(claim => claim.Type == "id")?.Value;
            if (string.IsNullOrEmpty(result))
            {
                throw new InvalidOperationException();
            }
            return result;
        }
    }
}
