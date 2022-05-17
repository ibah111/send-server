import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { checkLogin } from './check_login';
export class AuthUser<T> {
  output: T extends true ? 'Вы вошли' : 'Вы не вошли';
  error: T extends false ? string : never;
  id: T extends true ? number : never;
  login: T extends true ? string : never;
  login_result: T;
  birthdate: T extends true ? string : never;
  department: T extends true ? string : never;
  position: T extends true ? string : never;
  firstname: T extends true ? string : never;
  secondname: T extends true ? string : never;
  thirdname: T extends true ? string : never;
}
export class AuthUserSuccess extends AuthUser<true> {}
export class AuthUserError extends AuthUser<false> {}
export const Auth = createParamDecorator(
  async (_data: string, ctx: ExecutionContext) => {
    const { token } = ctx.switchToHttp().getRequest().body;
    const result = await checkLogin(token);
    if (result) {
      if (result?.login_result) {
        return result as AuthUserSuccess;
      } else {
        throw new UnauthorizedException(result as AuthUserError);
      }
    } else {
      throw new UnauthorizedException({
        message: 'Пустой или неправильный токен',
      });
    }
  },
);
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const { token } = ctx.switchToHttp().getRequest().body;
    const result = await checkLogin(token);
    if (result) {
      if (result?.login_result) {
        return true
      } else {
        throw new UnauthorizedException(result as AuthUserError);
      }
    } else {
      throw new UnauthorizedException({
        message: 'Пустой или неправильный токен',
      });
    }
  }
}
