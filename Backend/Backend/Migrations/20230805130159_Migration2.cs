using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class Migration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Users_SellerId",
                table: "Items");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Items_ArticleId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_OrderId",
                table: "OrderItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderItems",
                table: "OrderItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Items",
                table: "Items");

            migrationBuilder.RenameTable(
                name: "OrderItems",
                newName: "OrderArticles");

            migrationBuilder.RenameTable(
                name: "Items",
                newName: "Articles");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_ArticleId",
                table: "OrderArticles",
                newName: "IX_OrderArticles_ArticleId");

            migrationBuilder.RenameIndex(
                name: "IX_Items_SellerId",
                table: "Articles",
                newName: "IX_Articles_SellerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderArticles",
                table: "OrderArticles",
                columns: new[] { "OrderId", "ArticleId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Articles",
                table: "Articles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Articles_Users_SellerId",
                table: "Articles",
                column: "SellerId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderArticles_Articles_ArticleId",
                table: "OrderArticles",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderArticles_Orders_OrderId",
                table: "OrderArticles",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Articles_Users_SellerId",
                table: "Articles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderArticles_Articles_ArticleId",
                table: "OrderArticles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderArticles_Orders_OrderId",
                table: "OrderArticles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderArticles",
                table: "OrderArticles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Articles",
                table: "Articles");

            migrationBuilder.RenameTable(
                name: "OrderArticles",
                newName: "OrderItems");

            migrationBuilder.RenameTable(
                name: "Articles",
                newName: "Items");

            migrationBuilder.RenameIndex(
                name: "IX_OrderArticles_ArticleId",
                table: "OrderItems",
                newName: "IX_OrderItems_ArticleId");

            migrationBuilder.RenameIndex(
                name: "IX_Articles_SellerId",
                table: "Items",
                newName: "IX_Items_SellerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderItems",
                table: "OrderItems",
                columns: new[] { "OrderId", "ArticleId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Items",
                table: "Items",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Users_SellerId",
                table: "Items",
                column: "SellerId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Items_ArticleId",
                table: "OrderItems",
                column: "ArticleId",
                principalTable: "Items",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_OrderId",
                table: "OrderItems",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
