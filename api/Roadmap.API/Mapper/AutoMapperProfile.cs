using System;
using AutoMapper;
using Roadmap.API.DTOs;
using Roadmap.Domain.Models;
using Roadmap.Services.Images;

namespace Roadmap.API.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile(IImageService imageService)
        {
            CreateMap<ProjectDto, Project>()
                .ForMember(dest => dest.StartsOn, opt => opt.MapFrom(src => src.StartsOn.ToUniversalTime()))
                .ForMember(dest => dest.EndsOn,
                    opt => opt.MapFrom(src => src.EndsOn.HasValue ? src.EndsOn.Value.ToUniversalTime() : src.EndsOn));

            CreateMap<Project, ProjectDto>()
                .ForMember(dest => dest.ImageUrl,
                    opt => opt.MapFrom(src => imageService.GetImageUriAsync(src.ImageBlobName).Result))
                .ForMember(dest => dest.StartsOn, opt => opt.MapFrom(src => src.StartsOn.ToUniversalTime()))
                .ForMember(dest => dest.EndsOn,
                    opt => opt.MapFrom(src => src.EndsOn.HasValue ? src.EndsOn.Value.ToUniversalTime() : src.EndsOn));


            CreateMap<MilestoneDto, Milestone>()
                .ForMember(x => x.EndsOn,
                    opt => opt.MapFrom(src => src.EndsOn.HasValue ? src.EndsOn.Value.ToUniversalTime() : src.EndsOn))
                .ReverseMap();
        }
    }
}