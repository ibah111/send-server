import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { checkLogin } from './check_login';
export const Auth = createParamDecorator(
  async (_data: string, ctx: ExecutionContext) => {
    const { token } = ctx.switchToHttp().getRequest().body;
    const result = await checkLogin(token);
    if (result?.login_result) {
      return result;
    } else {
      throw new UnauthorizedException();
    }
  },
);
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const { token } = ctx.switchToHttp().getRequest().body;
    const result = await checkLogin(token);
    return result?.login_result;
  }
}

export interface AuthUser {
  id: number;
  login: string;
}
