﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Roadmap.Domain.Models;

namespace Roadmap.Domain
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions opts) : base(opts)
        {
        }
    }
}