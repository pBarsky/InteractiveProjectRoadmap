using AutoMapper;
using Roadmap.Domain.Models;

namespace Roadmap.Services.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Project, Project>()
                .ForMember(x => x.Milestones, opt => opt.Ignore())
                .ForMember(x => x.UserId, opt => opt.Ignore())
                .ForMember(x => x.UserId, opt => opt.Ignore())
                .ForMember(x => x.User, opt => opt.Ignore())
                .ForMember(x => x.Id, opt => opt.Ignore());
            CreateMap<Milestone, Milestone>()
                .ForMember(x => x.ParentProject, opt => opt.Ignore())
                .ForMember(x => x.ParentProjectId, opt => opt.Ignore())
                .ForMember(x => x.Id, opt => opt.Ignore());
        }
    }
}