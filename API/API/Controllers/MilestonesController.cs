using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Services.Milestones;
using Domain;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MilestonesController : ControllerBase
    {
        private readonly IMilestoneService _milestoneService;

        public MilestonesController(IMilestoneService milestoneService)
        {
            _milestoneService = milestoneService;
        }

        // DELETE api/<MilestonesController>/5
        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await _milestoneService.RemoveAsync(id);
        }

        // GET: api/<MilestonesController>
        [HttpGet]
        public async Task<IEnumerable<Milestone>> Get()
        {
            return await _milestoneService.GetAllAsync();
        }

        // GET api/<MilestonesController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            return Ok(await _milestoneService.GetAsync(id));
        }

        // POST api/<MilestonesController>
        [HttpPost]
        public async Task<IActionResult> Post(Milestone milestone)
        {
            var res = await _milestoneService.CreateAsync(milestone);
            return res ? Ok() : BadRequest();
        }

        // PUT api/<MilestonesController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, Milestone milestone)
        {
            var res = await _milestoneService.UpdateAsync(id, milestone);
            return res ? Ok() : BadRequest();
        }
    }
}