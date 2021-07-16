using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Roadmap.Domain.Models;
using Roadmap.Domain.Repositories.Interfaces;
using Roadmap.Services.Mapper;
using Roadmap.Services.Milestones;

namespace Roadmap.Services.Todos
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;
        private readonly IMilestoneService _milestoneService;
        private readonly IMapper _mapper;

        public TodoService(ITodoRepository todoRepository, IMilestoneService milestoneService)
        {
            _todoRepository = todoRepository;
            _milestoneService = milestoneService;
            _mapper = new AutoMapper.Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new AutoMapperProfile())));
        }

        public async Task<int> AddAsync(Todo todo, AppUser user)
        {
            if (todo == null)
            {
                return 0;
            }

            var parentMilestone = await _milestoneService.GetAsync(todo.ParentMilestoneId, user);
            if (parentMilestone == null)
            {
                return 0;
            }

            return await _todoRepository.AddAsync(todo);
        }

        public async Task<IEnumerable<Todo>> GetAllOfMilestoneAsync(Milestone milestone, AppUser user)
        {
            if (milestone == null)
            {
                return null;
            }

            return await _todoRepository.FindAsync(t =>
                t.ParentMilestoneId == milestone.Id && t.ParentMilestone.ParentProject.UserId == user.Id);
        }

        public async Task<Todo> GetAsync(int id, AppUser user)
        {
            if (id < 1)
            {
                return null;
            }

            return await _todoRepository.FindSingleOrDefault(t =>
                t.Id == id && t.ParentMilestone.ParentProject.UserId == user.Id);
        }

        public async Task<bool> DeleteAsync(int id, AppUser user)
        {
            if (id < 1)
            {
                return false;
            }

            var todo = await _todoRepository.FindSingleOrDefault(t =>
                t.Id == id && t.ParentMilestone.ParentProject.UserId == user.Id);

            if (todo == null)
            {
                return false;
            }

            return await _todoRepository.DeleteAsync(id);
        }

        public async Task<bool> UpdateAsync(Todo todo, AppUser user)
        {
            if (todo == null)
            {
                return false;
            }

            var destTodo = await _todoRepository.FindSingleOrDefault(t =>
                t.Id == todo.Id && t.ParentMilestone.ParentProject.UserId == user.Id);
            if (destTodo == null)
            {
                return false;
            }

            _mapper.Map(todo, destTodo);

            return await _todoRepository.UpdateAsync(destTodo);
        }
    }
}