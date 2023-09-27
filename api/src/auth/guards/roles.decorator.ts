import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../modules/user/models/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
