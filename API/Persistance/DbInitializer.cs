using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    public static class DbInitializer
    {
        public static void Initialize(DataContext context)
        {
            context.Database.EnsureCreated();

            if (context.Projects.Any() && context.Milestones.Any()) return;

            var projectGuid = Guid.NewGuid();
            var milestoneGuid = Guid.NewGuid();

            Milestone milestone = new()
            {
                Id = milestoneGuid,
                Name = "Bieganie ale jako milestone",
                Description = "No bieganie co więcej tu mówić.",
                ParentProjectId = projectGuid,
                // SubMilestones = new List<Milestone>()
                // {
                //     new Milestone
                //     {
                //         Id = Guid.NewGuid(),
                //         Name = "SubMilestone",
                //         Description = "SubMilestone description",
                //         ParentProjectId = projectGuid,
                //         ParentMilestoneId = milestoneGuid
                //     }
                // }
            };

            Project project = new()
            {
                Id = projectGuid,
                Name = "Bieganko",
                BackgroundImageUrl =
                    @"www.google.com",
                RootMilestone = milestone
            };

            context.Projects.Add(project);
            var res = context.SaveChanges();
            if (res == 0)
            {
                throw new Exception("Did not save data. Project");
            }
        }
    }
}