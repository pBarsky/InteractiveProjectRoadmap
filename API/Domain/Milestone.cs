using System;
using System.Collections.Generic;

namespace Domain
{
    public class Milestone
    {
        public string Description { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Milestone ParentMilestone { get; set; }
        public Guid? ParentMilestoneId { get; set; }
        public Project ParentProject { get; set; }
        public Guid ParentProjectId { get; set; }
        public MilestoneStatus Status { get; set; }

        public ICollection<Milestone> SubMilestones { get; set; } = new List<Milestone>();
    }
}