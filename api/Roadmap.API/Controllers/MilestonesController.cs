using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Roadmap.API.DTOs;
using Roadmap.Domain.Models;
using Roadmap.Services.Milestones;
using Roadmap.Services.Projects;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Roadmap.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MilestonesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IMilestoneService _milestoneService;
        private readonly IProjectService _projectService;
        private readonly UserManager<AppUser> _userManager;

        public MilestonesController(IMilestoneService milestoneService, IProjectService projectService,
            UserManager<AppUser> userManager, IMapper mapper)
        {
            _milestoneService = milestoneService;
            _projectService = projectService;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MilestoneDto>> Get(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var milestone = await _milestoneService.GetAsync(id, user);

            if (milestone == null)
            {
                return BadRequest("Milestone not found");
            }

            var mappedMilestone = _mapper.Map<MilestoneDto>(milestone);
            return Ok(mappedMilestone);
        }

        [HttpGet("of-project/{id}")]
        public async Task<ActionResult<IEnumerable<MilestoneDto>>> GetAllOfProject(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var project = await _projectService.GetAsync(id, user);

            if (project == null)
            {
                return BadRequest("No roadmap found.");
            }

            var mappedCollection =
                _mapper.Map<IEnumerable<MilestoneDto>>(await _milestoneService.GetAllOfProjectAsync(project, user));

            return Ok(mappedCollection);
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post(MilestoneDto milestoneDto)
        {
            if (milestoneDto == null)
            {
                return BadRequest("No milestone provided.");
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User was not found");
            }

            var mappedMilestoneDto = _mapper.Map<Milestone>(milestoneDto);
            var id = await _milestoneService.AddAsync(mappedMilestoneDto, user);

            if (id == default)
            {
                return BadRequest("Could not add milestone.");
            }

            return Ok(id);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> Put(MilestoneDto milestoneDto)
        {
            var user = await _userManager.GetUserAsync(User);
            var milestone = _mapper.Map<Milestone>(milestoneDto);
            var result = await _milestoneService.UpdateAsync(milestone, user);

            if (result)
            {
                return Ok(true);
            }

            return BadRequest("Could not update milestone");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var result = await _milestoneService.DeleteAsync(id, user);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}