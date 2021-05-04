using System;
using System.Collections.Generic;

namespace Domain
{
    public class Project
    {
        public string BackgroundImageUrl { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Milestone RootMilestone { get; set; }
    }
}