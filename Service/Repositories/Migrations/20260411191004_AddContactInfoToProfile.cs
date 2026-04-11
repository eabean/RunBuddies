using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RunBuddies.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddContactInfoToProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactInfo",
                table: "Profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactInfo",
                table: "Profiles");
        }
    }
}
