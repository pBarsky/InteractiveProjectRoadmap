using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistance.Configurations
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.Property(p => p.Name).IsRequired()
                .IsUnicode()
                .HasMaxLength(128);
            builder.Property(p => p.BackgroundImageUrl)
                .HasMaxLength(2048);
            builder.HasOne(p => p.RootMilestone)
                .WithOne(m => m.ParentProject)
                .HasForeignKey<Milestone>(m => m.ParentProjectId)
                .IsRequired();
        }
    }
}