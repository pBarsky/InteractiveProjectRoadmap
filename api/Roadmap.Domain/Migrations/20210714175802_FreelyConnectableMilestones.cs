using Microsoft.EntityFrameworkCore.Migrations;
using Roadmap.Domain.Models;

namespace Roadmap.Domain.Migrations
{
    public partial class FreelyConnectableMilestones : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConnectedToSourceHandleId",
                table: "Milestones",
                type: "int",
                nullable: true);

            migrationBuilder.Sql($"UPDATE Milestones SET ConnectedToSourceHandleId = {(int)HandleId.Right} WHERE ConnectedToId IS NOT NULL");

            migrationBuilder.AddColumn<int>(
                name: "ConnectedToTargetHandleId",
                table: "Milestones",
                type: "int",
                nullable: true);

            migrationBuilder.Sql($"UPDATE Milestones SET ConnectedToTargetHandleId = {(int)HandleId.Left} WHERE ConnectedToId IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConnectedToSourceHandleId",
                table: "Milestones");

            migrationBuilder.DropColumn(
                name: "ConnectedToTargetHandleId",
                table: "Milestones");
        }
    }
}
