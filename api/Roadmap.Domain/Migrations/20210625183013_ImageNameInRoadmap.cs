using Microsoft.EntityFrameworkCore.Migrations;

namespace Roadmap.Domain.Migrations
{
    public partial class ImageNameInRoadmap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageBlobName",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageBlobName",
                table: "Projects");
        }
    }
}
