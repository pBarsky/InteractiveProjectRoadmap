﻿using System;
using Roadmap.Domain.Models;

namespace Roadmap.API.DTOs
{
    public class MilestoneDto
    {
        public string Description { get; set; }

        public DateTime? EndsOn { get; set; }

        public int Id { get; set; }

        public string Name { get; set; }

        public int ParentProjectId { get; set; }

        public Status Status { get; set; }
    }
}