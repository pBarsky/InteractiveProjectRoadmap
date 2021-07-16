using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Roadmap.API.Mapper;
using Roadmap.Domain;
using Roadmap.Domain.Repositories.Implementations;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Images;
using Roadmap.Services.Milestones;
using Roadmap.Services.Projects;
using Roadmap.Services.Todos;
using Roadmap.Services.Token;

namespace Roadmap.API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" }); });
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddScoped<IMilestoneRepository, MilestoneRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IMilestoneService, MilestoneService>();
            services.AddScoped<ITodoRepository, TodoRepository>();
            services.AddScoped<ITodoService, TodoService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddSingleton(x => new BlobServiceClient(
                config.GetConnectionString("AzureBlobStorageConnection")));
            services.AddSingleton<IImageService, ImageService>();

            var provider = services.BuildServiceProvider();

            services.AddAutoMapper(config => config.AddProfile(new AutoMapperProfile(provider.GetService<IImageService>())));

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy",
                    policy =>
                    {
                        policy
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .WithExposedHeaders("WWW-Authenticate")
                            .AllowCredentials()
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .WithOrigins(config.GetValue<string>("CorsOrigin").Split(' '));
                    });
            });
            return services;
        }
    }
}