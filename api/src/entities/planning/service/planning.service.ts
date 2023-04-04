import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from '../models/planning.entity';
import { TrainService } from '../../train/service/train.service';
import { Train } from '../../train/models/train.entity';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/models/user.entity';
import * as moment from 'moment';
import { createPlanningDTO } from '../models/planning.dto';

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

  async createPlanning(day: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');
    const data: Train[] =
      await this.trainService.findTrainsOfOneDayWithSupportedGroups(day);
    const agents: User[] = await this.userService.getAgentsFromDay(formatDate);

    const users: createPlanningDTO[] = [];
    const listLastTrains = [];
    let assignedUserAndTrain: { user: User; train: Train };

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
            if (findUser) {
              if (
                moment(group.group_meeting_time.replace('H', ':'), 'H:mm')
                  .add(30, 'minutes')
                  .isAfter(moment(findUser.end_time, 'H:mm'))
              )
                continue;

              const lastTrain = listLastTrains.find(
                (x) => x.id === agents[i].user_id,
              );

              // TODO : Check si dans le train il y a un group ayant le même point de RDV (sûrement avec un find)
              // Si g = 0, je check si y'en a qui ont le même point de RDV et je les assigne si besoin

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
