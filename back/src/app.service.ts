import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Se envio la respuesta del getHello');
    return 'Bienvenidos a Sena mujeres digitales';
  }
}
