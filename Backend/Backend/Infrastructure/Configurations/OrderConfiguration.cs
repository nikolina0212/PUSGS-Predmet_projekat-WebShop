﻿using Backend.Models;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Backend.Infrastructure.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.OrderStatus)
                   .HasConversion(
                       x => x.ToString(),
                       x => Enum.Parse<OrderStatus>(x)
                   );

            builder.HasOne(x => x.Purchaser)
                   .WithMany(x => x.Orders)
                   .HasForeignKey(x => x.PurchaserId) 
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
