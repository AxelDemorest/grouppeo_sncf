import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../models/planning.entity';
import { TrainService } from '../../train/service/train.service';
import { Train } from '../../train/models/train.entity';
import { UserService } from '../../user/service/user.service';
import { PlanningDTO } from '../models/dto/planning.dto';
import { setEndTime } from '../helper/planning.helper';
import { AssignAgentDto } from '../models/dto/assign-agent.dto';
import * as moment from 'moment';
import 'moment/locale/fr';

@Injectable()
export class PlanningService {
  constructor(
    @Inject(TrainService)
    private readonly trainService: TrainService,
    @Inject(UserService)
    private readonly userService: UserService,
    @InjectRepository(Planning)
    private planningRepository: Repository<Planning>,
  ) {}

  async assignAgentToUser(assignAgentDto: AssignAgentDto): Promise<Planning> {
    const { userId, agentNumber, day } = assignAgentDto;
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    const findUser = await this.userService.findUserById(userId);

    // Trouver l'utilisateur avec l'userId donné
    const userPlanning = await this.planningRepository.findOne({
      where: {
        agentNumber: agentNumber,
        planning_day: formatDate,
      },
    });

    // If the planning is not found, throw an error or handle it appropriately
    if (!userPlanning) return null;

    // Mettre à jour le numéro Second'agents pour cet utilisateur
    userPlanning.planning_user = findUser;

    // Sauvegarder les modifications
    return this.planningRepository.save(userPlanning);
  }

  async createPlanning(day: string, numAgents: number) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');
    const trains: Train[] =
      await this.trainService.findTrainsOfOneDayWithSupportedGroups(day);

    function assignGroupToAgent(agent, group, train, agents, previousAssign) {
      if (!isAgentAvailable(agent, group, train, previousAssign)) {
        return false;
      }

      // Si l'agents est disponible et n'est pas surchargé, assignez le groupe à l'agents
      agent.groups.push(group);
      return true;
    }

    function isAgentAvailable(agent, group, train, previousAssign) {
      if (agent.endTime.length > 0) {
        if (
          moment(group.group_meeting_time.replace('H', ':'), 'H:mm')
            .add(30, 'minutes')
            .isAfter(moment(agent.endTime, 'H:mm'))
        )
          return false;
      }

      if (agent.groups.length > 0) {
        if (
          moment(
            agent.groups[agent.groups.length - 1].group_meeting_time.replace(
              'H',
              ':',
            ),
            'H:mm',
          )
            .add(25, 'minutes')
            .isAfter(moment(group.group_meeting_time.replace('H', ':'), 'H:mm'))
        )
          return false;
      }

      return true;
    }

    function findAgentWithLeastGroups(agents) {
      let minGroups = Number.MAX_SAFE_INTEGER;
      let agentWithLeastGroups = null;

      for (const agent of agents) {
        if (agent.groups.length < minGroups) {
          minGroups = agent.groups.length;
          agentWithLeastGroups = agent;
        }
      }

      return agentWithLeastGroups;
    }

    const agents = [];
    let previousAssign;

    for (const train of trains) {
      for (const group of train.train_groups) {
        if (!group.group_meeting_time) continue;
        let groupAssigned = false;

        // Check if there are any agents yet
        if (agents.length < 1) {
          const newAgent = {
            id: agents.length + 1,
            groups: [],
            startTime: group.group_meeting_time,
            endTime: setEndTime(group.group_meeting_time),
          };
          agents.push(newAgent);
          assignGroupToAgent(newAgent, group, train, agents, previousAssign);
          previousAssign = {
            train: train,
            group: group,
            agent: newAgent,
          };
          continue;
        }

        if (previousAssign) {
          if (
            parseInt(previousAssign.group.group_total_travellers) +
              parseInt(group.group_total_travellers) <
              200 &&
            previousAssign.train.train_number === train.train_number &&
            previousAssign.group.group_meeting_point ===
              group.group_meeting_point
          ) {
            previousAssign.agent.groups.push(group);
            previousAssign = {
              train: train,
              group: group,
              agent: previousAssign.agent,
            };
            continue;
          }
        }

        // Get agents with the least groups and try to assign the group to them
        const agentWithLeastGroups = findAgentWithLeastGroups(agents);
        if (
          assignGroupToAgent(
            agentWithLeastGroups,
            group,
            train,
            agents,
            previousAssign,
          )
        ) {
          groupAssigned = true;
          previousAssign = {
            train: train,
            group: group,
            agent: agentWithLeastGroups,
          };
        } else {
          // If not successful, try to assign to the other agents
          for (const agent of agents) {
            if (
              assignGroupToAgent(agent, group, train, agents, previousAssign)
            ) {
              groupAssigned = true;
              previousAssign = {
                train: train,
                group: group,
                agent: agent,
              };
              break;
            }
          }
        }

        if (
          moment(group.group_meeting_time.replace('H', ':'), 'H:mm').isAfter(
            moment('13:30', 'H:mm'),
          )
        )
          continue;

        if (!groupAssigned) {
          if (numAgents === 0 || agents.length < numAgents) {
            const newAgent = {
              id: agents.length + 1,
              groups: [],
              startTime: group.group_meeting_time,
              endTime: setEndTime(group.group_meeting_time),
            };
            agents.push(newAgent);
            newAgent.groups.push(group);
            previousAssign = {
              train: train,
              group: group,
              agent: newAgent,
            };
          }
        }
      }
    }

    const result = [];
    for (const agent of agents) {
      const planningDTO: PlanningDTO = {
        agentNumber: agent.id,
        planning_groups: agent.groups,
        planning_day: formatDate,
        start_time: agent.startTime,
        end_time: agent.endTime,
      };

      const savedPlanning = await this.planningRepository.save(planningDTO);
      result.push(savedPlanning);
    }

    return result;
  }

  async findAllPlanningsDistinctDay() {
    return await this.planningRepository
      .createQueryBuilder('planning')
      .select('planning.planning_day', 'planning_day')
      .distinct(true)
      .orderBy('planning.planning_day', 'ASC')
      .getRawMany();
  }

  async findAllPlanningsByDayDistinctDay(date: string) {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    return await this.planningRepository
      .createQueryBuilder('planning')
      .select('planning.planning_day', 'planning_day')
      .where('planning.planning_day = :day', { day: formatDate })
      .distinct(true)
      .getRawMany();
  }

  async findPlanning(day: string, id: number) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    return await this.planningRepository
      .createQueryBuilder('planning')
      .leftJoinAndSelect('planning.planning_user', 'user')
      .leftJoinAndSelect('planning.planning_groups', 'group')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('planning.planning_day = :planning_day', {
        planning_day: formatDate,
      })
      .andWhere('user.user_id = :user_id', {
        user_id: id,
      })
      .getOne();
  }

  async findPlanningByDay(day: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    return await this.planningRepository
      .createQueryBuilder('planning')
      .where('planning_day = :planning_day', { planning_day: formatDate })
      .getMany();
  }

  async findPlanningById(id: number) {
    return await this.planningRepository
      .createQueryBuilder('planning')
      .leftJoinAndSelect('planning.planning_user', 'user')
      .leftJoinAndSelect('planning.planning_groups', 'group')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('planning.planning_id = :planning_id', {
        planning_id: id,
      })
      .getOne();
  }

  async findPlanningByAgentNumber(planningDate: string, agentNumber: number) {
    const formatDate = planningDate.replace(new RegExp('-', 'g'), '/');

    return await this.planningRepository
      .createQueryBuilder('planning')
      .leftJoinAndSelect('planning.planning_user', 'user')
      .where('planning.planning_day = :planning_day', {
        planning_day: formatDate,
      })
      .andWhere('planning.agentNumber = :agentNumber', {
        agentNumber: agentNumber,
      })
      .getOne();
  }

  async getCountAgentsForPlanning(day: string): Promise<number> {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    const plannings = await this.planningRepository.find({
      where: { planning_day: formatDate },
    });
    return plannings.length;
  }

  async deletePlanning(id: number) {
    const planning = await this.planningRepository.findOne({
      where: { planning_id: id },
    });
    if (!planning) {
      throw new NotFoundException();
    }
  }

  async deletePlanningByDate(date: string): Promise<void> {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');
    await this.planningRepository.delete({ planning_day: formatDate });
  }
}
