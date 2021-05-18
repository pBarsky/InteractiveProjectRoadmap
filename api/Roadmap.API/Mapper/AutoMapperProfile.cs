using System;
using AutoMapper;
using Roadmap.API.DTOs;
using Roadmap.Domain.Models;

namespace Roadmap.API.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ProjectDto, Project>()
                .ForMember(dest => dest.StartsOn, opt => opt.MapFrom(src => src.StartsOn.ToUniversalTime()))
                .ForMember(dest => dest.EndsOn,
                    opt => opt.MapFrom(src => src.EndsOn.HasValue ? src.EndsOn.Value.ToUniversalTime() : src.EndsOn))
                .ReverseMap();
        }
    }
}