using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HauerBet.Migrations
{
    /// <inheritdoc />
    public partial class addLeage2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "League",
                table: "Fixtures",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "League",
                table: "Fixtures");
        }
    }
}
