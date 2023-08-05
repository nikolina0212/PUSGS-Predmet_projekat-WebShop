using Backend.Models;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Backend.Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.UserType)
                   .HasConversion(
                       x => x.ToString(),
                       x => Enum.Parse<UserTypes>(x)
                   );

            builder.HasIndex(x => x.Email).IsUnique();
        }
    }
}
