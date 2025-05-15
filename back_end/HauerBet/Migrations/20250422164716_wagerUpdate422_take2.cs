using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HauerBet.Migrations
{
    /// <inheritdoc />
    public partial class wagerUpdate422_take2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "awayVig",
                table: "Wagers");

            migrationBuilder.RenameColumn(
                name: "homeVig",
                table: "Wagers",
                newName: "Vig");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Vig",
                table: "Wagers",
                newName: "homeVig");

            migrationBuilder.AddColumn<int>(
                name: "awayVig",
                table: "Wagers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
