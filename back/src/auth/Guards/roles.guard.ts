import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload = request.payload;

    const hasRole = () =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      requiredRoles.some((roles) => payload?.roles?.includes(roles));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const validate = payload && payload.roles && hasRole();

    if (!validate) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este contenido ',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return validate;
  }
}
