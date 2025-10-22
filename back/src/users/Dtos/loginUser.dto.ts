import { PickType } from '@nestjs/mapped-types';
import { CreatedUserDto } from './createUser.dto';

export class LoginUserDto extends PickType(CreatedUserDto, [
  'userName',
  'password',
] as const) {}
