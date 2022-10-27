import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { createGroupDTO, GroupDTO } from "../models/group.dto";
import { GroupService } from "../service/group.service";

@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post('/group')
    async createGroups(@Res() res, @Body() groups: createGroupDTO[]) {
        const createGroups = await this.groupService.createGroups(groups);
        return res.status(HttpStatus.OK).json({
            message: 'Groups has been submitted successfully!',
            post: createGroups,
        });
    }

}