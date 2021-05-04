using AutoMapper;
using Domain;

namespace Application.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //TODO: nwm czy jest poprawnie także poprawić
            CreateMap<Project, Project>();
            CreateMap<Milestone, Milestone>();
        }
    }
}