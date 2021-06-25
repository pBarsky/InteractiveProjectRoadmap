using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Roadmap.Domain.Models
{
    public class Project
    {
        [MaxLength(2048)]
        public string Description { get; set; }

        public DateTime? EndsOn { get; set; }

        public int Id { get; set; }

        public IList<Milestone> Milestones { get; set; } = new List<Milestone>();

        [MaxLength(255)]
        [Required]
        public string Name { get; set; }

        [Required]
        public DateTime StartsOn { get; set; }

        public AppUser User { get; set; }
        public string UserId { get; set; }
        public string ImageBlobName { get; set; }
    }
}