using System;

namespace Roadmap.API.DTOs
{
    public class ProjectDto
    {
        public string Description { get; set; }

        public DateTime? EndsOn { get; set; }

        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime StartsOn { get; set; }
    }
}