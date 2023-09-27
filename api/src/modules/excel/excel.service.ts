import { Inject, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { Buffer } from 'buffer';
import { GroupService } from '../group/service/group.service';
import { PlanningService } from '../planning/service/planning.service';
import { GroupDTO } from '../group/models/group.dto';
import { MeetingPointService } from '../meeting-point/service/meeting-point.service';
import { RadioService } from '../radio/service/radio.service';

@Injectable()
export class ExcelService {
  constructor(
    @Inject(GroupService)
    private readonly groupService: GroupService,
    @Inject(PlanningService)
    private readonly planningService: PlanningService,
    @Inject(MeetingPointService)
    private readonly meetingPointService: MeetingPointService,
    @Inject(RadioService)
    private readonly radioService: RadioService,
  ) {}

  async generateExcelFileV2(
    planningId: number,
    groups: GroupDTO[],
  ): Promise<Buffer> {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      'template_planning_group.xlsx',
    );

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet(1);

    const planning = await this.planningService.findPlanningById(planningId);

    worksheet.getRow(5).getCell(4).value = planning.planning_day;
    worksheet.getRow(8).getCell(4).value = planning.agentNumber;
    worksheet.getRow(6).getCell(4).value = `${
      planning.planning_user?.user_first_name || ''
    } ${planning.planning_user?.user_last_name || ''}`;
    worksheet
      .getRow(7)
      .getCell(4).value = `${planning.start_time} - ${planning.end_time}`;
    worksheet.getRow(9).getCell(4).value = `Eliott: 599570 | Bénédicte: 599948`;

    for (const [index, group] of Array.from(groups.entries())) {
      const meetingPoint = await this.meetingPointService.getMeetingPoint(
        group.group_meeting_point,
      );

      const rowValues = [
        group.group_meeting_time ?? '',
        group.group_train?.train_number ?? '',
        group.group_train?.train_track ?? '',
        group.group_train?.train_hour ?? '',
        group.group_destination ?? '',
        group.group_name ?? '',
        group.group_type ?? '',
        group.group_car_number ?? '',
        group.group_meeting_point ?? '',
        meetingPoint?.radio?.number || '',
        group.group_prestation ? 'TM' : '' ?? '',
        group.group_total_travellers ?? '',
      ];
      const row = worksheet.getRow(index + 13);
      row.values = rowValues;
      row.height = 25;
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }

  async generateExcelFilePoint(meetingPoint, day, groups: GroupDTO[]) {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      'template_planning_point_group.xlsx',
    );

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet(1);

    worksheet.getRow(5).getCell(4).value = day;
    worksheet.getRow(6).getCell(4).value = meetingPoint;
    worksheet.getRow(9).getCell(4).value = `Eliott: 599570 | Bénédicte: 599948`;

    for (const [index, group] of Array.from(groups.entries())) {
      let agentRadio = null;

      if (group.group_planning) {
        agentRadio = await this.radioService.findRadioByAgentNumber(
          group.group_planning.agentNumber,
        );
      }

      const rowValues = [
        group.group_meeting_time ?? '',
        group.group_train?.train_number ?? '',
        group.group_train?.train_track ?? '',
        group.group_train?.train_hour ?? '',
        group.group_destination ?? '',
        group.group_name ?? '',
        group.group_type ?? '',
        group.group_car_number ?? '',
        agentRadio?.number || '',
        group.group_prestation ? 'TM' : '' ?? '',
        group.group_responsable_departure_day ?? '',
        group.group_responsable_phone_departure_day ?? '',
        group.group_total_travellers ?? '',
      ];

      const row = worksheet.getRow(index + 13);
      row.values = rowValues;
      row.height = 25;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }
}
