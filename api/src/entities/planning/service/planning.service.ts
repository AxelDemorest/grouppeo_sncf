import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../models/planning.entity';
import { TrainService } from '../../train/service/train.service';
import { Train } from '../../train/models/train.entity';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/models/user.entity';
import { createPlanningDTO, PlanningDTO } from '../models/dto/planning.dto';
import { setEndTime, diffHour } from '../helper/planning.helper';
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

    const findUser = await this.userService.findUserById(userId);

    // Trouver l'utilisateur avec l'userId donné
    const userPlanning = await this.planningRepository.findOne({
      where: {
        agentNumber: agentNumber,
        planning_day: day,
      },
    });

    // If the planning is not found, throw an error or handle it appropriately
    if (!userPlanning) return null;

    // Mettre à jour le numéro d'agent pour cet utilisateur
    userPlanning.planning_user = findUser;

    // Sauvegarder les modifications
    return this.planningRepository.save(userPlanning);
  }

  async createPlanning(day: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');
    const trains: Train[] =
      await this.trainService.findTrainsOfOneDayWithSupportedGroups(day);

    function assignGroupToAgent(agent, group, agents) {
      if (!isAgentAvailable(agent, group)) {
        return false;
      }

      // Si l'agent est disponible et n'est pas surchargé, assignez le groupe à l'agent
      agent.groups.push(group);
      return true;
    }

    function isAgentAvailable(agent, group) {
      const groupPrestation = group.group_prestation;

      /*(groupPrestation &&
          agent.groups.length > 0 &&
          moment(
            agent.groups[agent.groups.length - 1].group_meeting_time.replace(
              'H',
              ':',
            ),
            'H:mm',
          )
            .add(60, 'minutes')
            .isBefore(groupMeetingTime)) ||*/

      if (agent.endTime.length > 0) {
        if (
          moment(group.group_meeting_time.replace('H', ':'), 'H:mm')
            .add(25, 'minutes')
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

    function isAgentOverloaded(agent, agents) {
      const averageGroups = calculateAverageGroups(agents);

      return agent.groups.length > averageGroups;
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

    function calculateAverageGroups(agents) {
      const totalAgents = agents.length;

      if (totalAgents === 0) {
        return 0; // ou retourner une valeur par défaut appropriée
      }

      if (totalAgents === 1) {
        return agents[0].groups.length;
      }

      let totalGroups = 0;

      for (const agent of agents) {
        totalGroups += agent.groups.length;
      }

      return totalGroups / totalAgents;
    }

    const agents = [];

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
          assignGroupToAgent(newAgent, group, agents);
          continue;
        }

        // Get agent with the least groups and try to assign the group to them
        const agentWithLeastGroups = findAgentWithLeastGroups(agents);
        if (assignGroupToAgent(agentWithLeastGroups, group, agents)) {
          groupAssigned = true;
        } else {
          // If not successful, try to assign to the other agents
          for (const agent of agents) {
            if (assignGroupToAgent(agent, group, agents)) {
              groupAssigned = true;
              break;
            }
          }
        }

        if (
          moment(group.group_meeting_time.replace('H', ':'), 'H:mm').isAfter(
            moment('16:00', 'H:mm'),
          )
        )
          continue;
        if (!groupAssigned) {
          const newAgent = {
            id: agents.length + 1,
            groups: [],
            startTime: group.group_meeting_time,
            endTime: setEndTime(group.group_meeting_time),
          };
          agents.push(newAgent);
          newAgent.groups.push(group);
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

  async createPlanningInDev(day: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');
    const data: Train[] =
      await this.trainService.findTrainsOfOneDayWithSupportedGroups(day);
    const agents: User[] = await this.userService.getAgentsFromDay(formatDate);

    const users: createPlanningDTO[] = [];
    const listLastTrains = [];
    let assignedUserAndTrain: { user: User; train: Train };
    let consecutiveTrainCount = 0;

    const diffHour = (firstHour: string, secondHour: string) => {
      const h1 = firstHour.split('H');
      const h2 = secondHour.split('H');
      const diff =
        (parseInt(h2[0], 10) - parseInt(h1[0], 10)) * 60 +
        (parseInt(h2[1], 10) - parseInt(h1[1], 10));
      return diff >= 25;
    };

    const setEndTime = (hour) => {
      const replaceHour = hour.replace('H', ':');
      const newHour = moment(replaceHour, 'H:mm')
        .add(7, 'hours')
        .add(45, 'minutes');
      return newHour.format('H:mm');
    };

    if (!data) return;
    else {
      // -----------------------------
      // ------ LOOP ON TRAINS -------
      // -----------------------------
      for (let t = 0; t < data.length; t++) {
        const train = data[t];

        // -----------------------------
        // ------ LOOP ON GROUPS -------
        // -----------------------------
        for (let g = 0; g < train.train_groups.length; g++) {
          const group = train.train_groups[g];
          if (!group.group_meeting_time) break;

          // -----------------------------
          // ------- LOOP ON USERS -------
          // -----------------------------
          for (let i = 0; i < agents.length; i++) {
            const findUser = users.find(
              (x) => x.planning_user.user_id === agents[i].user_id,
            );

            // Si l'agent actuel est le même que le dernier et que le compteur de trains consécutifs atteint 2, passez à l'agent suivant
            if (
              assignedUserAndTrain?.user?.user_id === agents[i].user_id &&
              consecutiveTrainCount >= 2
            )
              continue;

            // Si l'agent actuel n'est pas le même que le dernier, réinitialisez le compteur de trains consécutifs
            if (assignedUserAndTrain?.user?.user_id !== agents[i].user_id) {
              consecutiveTrainCount = 0;
            }

            if (findUser) {
              if (
                moment(group.group_meeting_time.replace('H', ':'), 'H:mm')
                  .add(30, 'minutes')
                  .isAfter(moment(findUser.end_time, 'H:mm')) ||
                (group.group_prestation &&
                  findUser.planning_groups.some((planningGroup) =>
                    moment(
                      planningGroup.group_meeting_time.replace('H', ':'),
                      'H:mm',
                    )
                      .add(1, 'hour')
                      .isBefore(
                        moment(
                          group.group_meeting_time.replace('H', ':'),
                          'H:mm',
                        ),
                      ),
                  ))
              )
                continue;

              const lastTrain = listLastTrains.find(
                (x) => x.id === agents[i].user_id,
              );

              if (
                train.train_groups[g - 1]?.group_meeting_point ===
                  group?.group_meeting_point &&
                assignedUserAndTrain?.user.user_id === agents[i].user_id &&
                assignedUserAndTrain?.train.train_id === train.train_id &&
                !findUser.planning_groups.includes(train.train_groups[g - 2]) &&
                parseInt(
                  train.train_groups[g - 1]?.group_total_travellers,
                  10,
                ) +
                  parseInt(group?.group_total_travellers, 10) <=
                  160
              ) {
                lastTrain.prevTrain = group.group_meeting_time;
                findUser.planning_groups.push({ ...group, group_train: train });
                assignedUserAndTrain = {
                  user: agents[i],
                  train: train,
                };
                consecutiveTrainCount++;
                break;
              }

              if (diffHour(lastTrain.prevTrain, group.group_meeting_time)) {
                if (!findUser.planning_groups) {
                  findUser.planning_groups = [];
                }
                findUser.planning_groups.push({ ...group, group_train: train });
                lastTrain.prevTrain = group.group_meeting_time;
                assignedUserAndTrain = {
                  user: agents[i],
                  train: train,
                };
                consecutiveTrainCount++;
                break;
              }
            } else {
              listLastTrains.push({
                id: agents[i].user_id,
                prevTrain: group.group_meeting_time,
              });
              users.push({
                planning_user: agents[i],
                planning_groups: [{ ...group, group_train: train }],
                planning_day: formatDate,
                start_time: group.group_meeting_time,
                end_time: setEndTime(group.group_meeting_time),
              });
              assignedUserAndTrain = {
                user: agents[i],
                train: train,
              };
              consecutiveTrainCount++;
              break;
            }
          }
        }
      }
    }

    return await this.planningRepository.save(users);
  }

  async findAllPlanningsDistinctDay() {
    return await this.planningRepository
      .createQueryBuilder('planning')
      .select('planning.planning_day', 'planning_day')
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
}
