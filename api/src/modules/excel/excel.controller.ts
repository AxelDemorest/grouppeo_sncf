import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import { GroupDTO } from '../group/models/group.dto';

@Controller('api/excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Post('export/planning/:planningId')
  async exportPlanningToExcel(
    @Res() res: Response,
    @Param('planningId') planningId: string,
    @Body('tableData') tableData: GroupDTO[],
  ) {
    const buffer = await this.excelService.generateExcelFileV2(
      Number(planningId),
      tableData,
    );

    res.setHeader('Content-Disposition', 'attachment; filename=myfile.xlsx');
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }

  @Post('export/meeting-point/:meetingPointId/day/:day')
  async exportMeetingPointToExcel(
    @Res() res: Response,
    @Param('meetingPointId') meetingPointId: string,
    @Param('day') day: string,
    @Body('tableData') tableData: GroupDTO[],
  ) {
    const buffer = await this.excelService.generateExcelFilePoint(
      meetingPointId,
      day,
      tableData,
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=planning_point_groupe.xlsx',
    );
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
