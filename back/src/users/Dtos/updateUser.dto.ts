import { PartialType } from '@nestjs/mapped-types';
import { CreatedUserDto } from './createUser.dto';

export class UpdateUserDto extends PartialType(CreatedUserDto) {}
