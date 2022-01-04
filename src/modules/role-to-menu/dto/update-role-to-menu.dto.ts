import { PartialType } from '@nestjs/swagger';
import { CreateRoleToMenuDto } from './create-role-to-menu.dto';

export class UpdateRoleToMenuDto extends PartialType(CreateRoleToMenuDto) {}
