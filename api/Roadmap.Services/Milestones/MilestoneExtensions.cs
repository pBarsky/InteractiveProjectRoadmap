using System;
using System.Collections.Generic;
using System.Text;
using Roadmap.Domain.Migrations;
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
            if (target == null)
            {
                return false;
            }

            if (milestone.ConnectedToTargetHandleId == target.ConnectedToSourceHandleId)
            {
                return false;
            }

            return true;
        }

        public static bool IsAnotherPointingToMilestoneProperly(this Milestone milestone, Milestone targetting)
        {
            if (targetting != null)
            {
                if (targetting.ConnectedToTargetHandleId == milestone.ConnectedToSourceHandleId)
                {
                    return false;
                }

                if (targetting.Id == milestone.ConnectedToId)
                {
                    return false;
                }
            }
            return true;
        }
    }
}
