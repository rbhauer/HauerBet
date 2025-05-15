using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HauerBet.Migrations
{
    /// <inheritdoc />
    public partial class updateFixtures2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Vig",
                table: "Fixtures",
                newName: "HomeVig");

            migrationBuilder.AlterColumn<string>(
                name: "FixtureID",
                table: "Fixtures",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "AwayVig",
                table: "Fixtures",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AwayVig",
                table: "Fixtures");

            migrationBuilder.RenameColumn(
                name: "HomeVig",
                table: "Fixtures",
                newName: "Vig");

            migrationBuilder.AlterColumn<int>(
                name: "FixtureID",
                table: "Fixtures",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");
        }
    }
}
