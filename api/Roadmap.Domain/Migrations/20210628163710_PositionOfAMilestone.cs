using Microsoft.EntityFrameworkCore.Migrations;

namespace Roadmap.Domain.Migrations
{
    public partial class PositionOfAMilestone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PosX",
                table: "Milestones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PosY",
                table: "Milestones",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PosX",
                table: "Milestones");

            migrationBuilder.DropColumn(
                name: "PosY",
                table: "Milestones");
        }
    }
}
