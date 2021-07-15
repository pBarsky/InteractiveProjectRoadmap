using Roadmap.Domain.Models;

namespace Roadmap.Services.Milestones
{
    public static class MilestoneExtensions
    {
        public static bool IsConnectedToSelf(this Milestone milestone)
        {
            return milestone.ConnectedToId == milestone.Id;
        }

        public static bool IsProperlyConnectedToAny(this Milestone milestone)
        {
            return milestone.ConnectedToId != null && milestone.ConnectedToSourceHandleId != null && milestone.ConnectedToTargetHandleId != null;
        }

        public static bool IsProperlyConnectedToTarget(this Milestone milestone, Milestone target)
        {
            return target != null && milestone.ConnectedToTargetHandleId != target.ConnectedToSourceHandleId;
        }

        public static bool IsAnotherPointingToMilestoneProperly(this Milestone milestone, Milestone targetting)
        {
            if (targetting == null)
            {
                return true;
            }

            if (targetting.ConnectedToTargetHandleId == milestone.ConnectedToSourceHandleId)
            {
                return false;
            }

            return targetting.Id != milestone.ConnectedToId;
        }
    }
}
