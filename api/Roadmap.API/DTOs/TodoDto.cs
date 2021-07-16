namespace Roadmap.API.DTOs
{
    public class TodoDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentMilestoneId { get; set; }
        public bool IsDone { get; set; }
    }
}