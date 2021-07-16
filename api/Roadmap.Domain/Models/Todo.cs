using System.ComponentModel.DataAnnotations;

namespace Roadmap.Domain.Models
{
    public class Todo
    {
        public int Id { get; set; }
        [MaxLength(256)] public string Name { get; set; }
        public bool IsDone { get; set; }
        public int ParentMilestoneId { get; set; }
        public Milestone ParentMilestone { get; set; }
    }
}