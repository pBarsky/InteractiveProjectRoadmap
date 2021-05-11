using System;

namespace Roadmap.Domain.Models
{
    public class RefreshToken
    {
        public AppUser AppUserP { get; set; }

        public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(7);
        public int Id { get; set; }

        public bool isActive => Revoked == null && !isExpired;
        public bool isExpired => DateTime.UtcNow >= Expires;
        public DateTime? Revoked { get; set; }
        public string Token { get; set; }
    }
}