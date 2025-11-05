import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreatedUserDto } from './createUser.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreatedUserDto) {
  @ApiProperty({
    description: 'UUID del usuario a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
  @IsUUID('4', { message: 'El id del usuario debe tener un formato UUID' })
  uuid: string;
}
