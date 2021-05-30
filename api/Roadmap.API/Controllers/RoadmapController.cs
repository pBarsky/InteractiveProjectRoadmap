using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Roadmap.API.DTOs;
using Roadmap.Domain.Models;
using Roadmap.Services.Projects;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Roadmap.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoadmapController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IProjectService _projectService;
        private readonly UserManager<AppUser> _userManager;

        public RoadmapController(UserManager<AppUser> userManager, IProjectService projectService, IMapper mapper)
        {
            _userManager = userManager;
            _projectService = projectService;
            _mapper = mapper;
        }

        // GET: api/<RoadmapController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            var projects = await _projectService.GetAllAsync(user);
            var mappedProjects = _mapper.Map<IEnumerable<ProjectDto>>(projects);
            return Ok(mappedProjects);
        }

        // GET api/<RoadmapController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> Get(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var project = await _projectService.GetAsync(id, user);
            if (project == null)
            {
                return BadRequest("Did not find roadmap.");
            }

            return Ok(_mapper.Map<ProjectDto>(project));
        }

        // POST api/<RoadmapController>
        [HttpPost]
        public async Task<ActionResult<int>> Post(ProjectDto projectDto)
        {
            var user = await _userManager.GetUserAsync(User);
            var project = _mapper.Map<Project>(projectDto);
            var id = await _projectService.AddAsync(project, user);
            if (id == default)
            {
                return BadRequest("Could not add roadmap.");
            }

            return Ok(id);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> Put(ProjectDto projectDto)
        {
            var user = await _userManager.GetUserAsync(User);
            var project = _mapper.Map<Project>(projectDto);
            var result = await _projectService.UpdateAsync(project, user);

            if (result)
            {
                return Ok(true);
            }

            return BadRequest("Could not update roadmap.");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var result = await _projectService.DeleteAsync(id, user);

            if (result)
            {
                return Ok(true);
            }

            return BadRequest("Could not delete roadmap.");
        }
    }
}