import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/common/enum/user.enum';

export const ROLES_KEY = 'roles'; // Metadata key for roles
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
