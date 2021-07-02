using Microsoft.EntityFrameworkCore.Migrations;

namespace Roadmap.Domain.Migrations
{
    public partial class ConnectedMilestone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConnectedToId",
                table: "Milestones",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Milestones_ConnectedToId",
                table: "Milestones",
                column: "ConnectedToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Milestones_Milestones_ConnectedToId",
                table: "Milestones",
                column: "ConnectedToId",
                principalTable: "Milestones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Milestones_Milestones_ConnectedToId",
                table: "Milestones");

            migrationBuilder.DropIndex(
                name: "IX_Milestones_ConnectedToId",
                table: "Milestones");

            migrationBuilder.DropColumn(
                name: "ConnectedToId",
                table: "Milestones");
        }
    }
}
