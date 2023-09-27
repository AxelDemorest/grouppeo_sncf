import { User } from '../../../user/models/user.entity';
import { Group } from '../../../group/models/group.entity';

export class PlanningDTO {
  agentNumber: number;
  planning_id?: number;
  start_time: string;
  end_time: string;
  planning_user?: User;
  planning_groups: Group[];
  planning_day: string;
}

export class createPlanningDTO {
  start_time: string;
  end_time: string;
  planning_user: User;
  planning_groups: Group[];
  planning_day: string;
}
