﻿using System;
using System.ComponentModel.DataAnnotations;

namespace Roadmap.Domain.Models
{
    public class Milestone
    {
        [MaxLength(2048)]
        public string Description { get; set; }

        public DateTime? EndsOn { get; set; }

        public int Id { get; set; }

        [MaxLength(255)]
        [Required]
        public string Name { get; set; }

        public Project ParentProject { get; set; }

        public int ParentProjectId { get; set; }

        [EnumDataType(typeof(Status))]
        public Status Status { get; set; } = Status.ToBeStarted;
    }
}