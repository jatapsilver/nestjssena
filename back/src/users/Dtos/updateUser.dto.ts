import { PartialType } from '@nestjs/mapped-types';
import { CreatedUserDto } from './createUser.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateUserDto extends PartialType(CreatedUserDto) {}
