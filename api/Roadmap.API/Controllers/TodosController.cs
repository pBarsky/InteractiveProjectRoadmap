using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Roadmap.API.DTOs;
using Roadmap.Domain.Models;
using Roadmap.Services.Todos;

namespace Roadmap.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        private readonly ITodoService _todoService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public TodosController(ITodoService todoService, UserManager<AppUser> userManager, IMapper mapper)
        {
            _todoService = todoService;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoDto>> Get(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var todo = await _todoService.GetAsync(id, user);

            if (todo == null)
            {
                return BadRequest("Todo not found");
            }

            return Ok(_mapper.Map<TodoDto>(todo));
        }

        [HttpPost]
        public async Task<ActionResult<int>> Post(TodoDto todoDto)
        {
            if (todoDto == null)
            {
                return BadRequest("No milestone provided.");
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User was not found");
            }

            var todo = _mapper.Map<Todo>(todoDto);
            var id = await _todoService.AddAsync(todo, user);

            if (id == default)
            {
                return BadRequest("Could not add the todo.");
            }

            return Ok(id);
        }

        [HttpPut]
        public async Task<ActionResult<bool>> Put(TodoDto todoDto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User was not found");
            }

            var todo = _mapper.Map<Todo>(todoDto);
            var result = await _todoService.UpdateAsync(todo, user);

            if (result)
            {
                return Ok(true);
            }

            return BadRequest("Could not update the todo.");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User was not found");
            }


            var result = await _todoService.DeleteAsync(id, user);

            if (result)
            {
                return Ok(true);
            }

            return BadRequest("Could not delete milestone.");
        }
    }
}
