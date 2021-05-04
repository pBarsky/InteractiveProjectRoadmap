using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistance.Configurations
{
    public class MilestoneConfiguration : IEntityTypeConfiguration<Milestone>
    {
        public void Configure(EntityTypeBuilder<Milestone> builder)
        {
            builder.Property(m => m.Description)
                .IsUnicode()
                .HasMaxLength(512)
                .IsRequired();
            builder.Property(m => m.Name)
                .IsUnicode()
                .HasMaxLength(256)
                .IsRequired();
            builder.Property(m => m.Status)
                .IsRequired()
                .HasDefaultValue(MilestoneStatus.Pending);
            builder.HasMany(m => m.SubMilestones)
                .WithOne(m => m.ParentMilestone)
                .HasForeignKey(m => m.ParentMilestoneId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}