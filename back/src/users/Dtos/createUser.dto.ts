import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatedUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  @MinLength(3, {
    message: 'El nombre debe tener minimo 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El nombre no puede contener mas de 25 caracteres',
  })
  name: string;

  @IsNotEmpty({
    message: 'El apellido es requerido',
  })
  @IsString({
    message: 'El apellido debe ser una cadena de caracteres',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El apellido solo puede contener letras y espacios',
  })
  @MinLength(3, {
    message: 'El apellido debe tener minimo 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El apellido no puede contener mas de 25 caracteres',
  })
  lastName: string;

  address: string;

  @IsEmail()
  email: string;
  phoneNumber: number;
  birthDate: Date;
  userName: string;
  password: string;
}
