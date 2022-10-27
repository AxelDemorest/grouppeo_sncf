import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { GroupType } from "src/entities/group/models/group.entity";
import { DataSource, Repository } from "typeorm";
import { createTrainDTO, TrainDTO } from "../models/train.dto";
import { Train } from "../models/train.entity";

@Injectable()
export class TrainService {
    constructor(
        @InjectRepository(Train) private trainsRepository: Repository<Train>,
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async createTrains(trains: createTrainDTO[]) {

        const createTrains = [];

        const enumGroupType = {
            'AUT': 'autonome',
            'ENF': 'enfant',
            'HAN': 'handicapé'
        }
        
        for (const element of trains) {
            let foundTrain = createTrains.find(row => row.train_number === element.train_number);
            let { train_number, train_hour, train_groups, train_date, ...groupValues }: createTrainDTO = element;
            let trainElement = {
                train_number,
                train_hour,
                train_groups,
                train_date
            };
            groupValues.group_type = enumGroupType[groupValues.group_type] ? 'non défini' : enumGroupType[groupValues.group_type];
            if(foundTrain) {
                foundTrain.train_groups.push(groupValues);
            } else {
                trainElement.train_groups = [];
                trainElement.train_groups.push(groupValues);
                createTrains.push(trainElement);
            }
        };
        await this.trainsRepository.save(createTrains);
        return createTrains;
    }
}