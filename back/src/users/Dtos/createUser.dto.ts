import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatedUserDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'El nombre es requerido' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(3, {
    message: 'El nombre debe tener minimo 3 caracteres',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MaxLength(25, {
    message: 'El nombre no puede contener mas de 25 caracteres',
  })
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({
    message: 'El apellido es requerido',
  })
  @IsString({
    message: 'El apellido debe ser una cadena de caracteres',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El apellido solo puede contener letras y espacios',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(3, {
    message: 'El apellido debe tener minimo 3 caracteres',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MaxLength(25, {
    message: 'El apellido no puede contener mas de 25 caracteres',
  })
  lastName: string;
  address: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail()
  email: string;
  phoneNumber: number;
  birthDate: Date;
  userName: string;
  password: string;
}
