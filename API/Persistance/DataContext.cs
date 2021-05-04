using System;
using System.Reflection;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistance.Configurations;

namespace Persistance
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Milestone> Milestones { get; set; }

        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetAssembly(typeof(ProjectConfiguration)) ?? throw new InvalidOperationException("No assembly found."));
            base.OnModelCreating(modelBuilder);
        }
    }
}