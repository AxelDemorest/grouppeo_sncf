import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { createGroupDTO, GroupDTO } from "../models/group.dto";
import { GroupService } from "../service/group.service";

@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

}