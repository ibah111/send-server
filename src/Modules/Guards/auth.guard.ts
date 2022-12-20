import { User as UserContact } from '@contact/models';
import { User as UserLocal } from '../Database/local.database/models/User.model';
import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { checkLogin } from './check_login';
import { ClassConstructor } from 'class-transformer';
import { getConnectionToken } from '@sql-tools/nestjs-sequelize';
import { Model } from '@sql-tools/sequelize-typescript';
import { ModuleRef } from '@nestjs/core';
export class AuthUser<T> {
  output: T extends true ? 'Вы вошли' : 'Вы не вошли';
  error: T extends false ? string : never;
  id: T extends true ? number : never;
  login: T extends true ? string : never;
  login_result: T;
  token: string;
  birthdate: T extends true ? string : never;
  department: T extends true ? string : never;
  position: T extends true ? string : never;
  firstname: T extends true ? string : never;
  secondname: T extends true ? string : never;
  thirdname: T extends true ? string : never;
  avatar: T extends true ? string : never;
}
export class AuthUserSuccess extends AuthUser<true> {}
export class AuthUserError extends AuthUser<false> {}
export const Auth = createParamDecorator(
  async (_data: string, ctx: ExecutionContext) => {
    const data = ctx.switchToHttp().getRequest();
    if (data.auth) {
      return data.auth;
    }
    throw new UnauthorizedException({
      message: 'Вы не авторизованы',
    });
  },
);
export class AuthResult {
  user: AuthUserSuccess;
  userLocal: UserLocal | null;
  userContact: UserContact | null;
}
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly modelUserContact = this.getRepository(
    UserContact,
    'contact',
  );
  private readonly modelUserLocal = this.getRepository(UserLocal, 'local');
  constructor(private moduleRef: ModuleRef) {}
  private getRepository<T extends Model>(
    model: ClassConstructor<T>,
    connection_name: string,
  ) {
    const connection = this.moduleRef.get(getConnectionToken(connection_name), {
      strict: false,
    });
    return connection.getRepository<T>(model);
  }
  async canActivate(ctx: ExecutionContext) {
    const data = ctx.switchToHttp().getRequest();
    const body = data.body;
    if (body) {
      const { token } = body;
      const result = await checkLogin(token);
      if (result) {
        if (result?.login_result) {
          const user: AuthResult = {
            user: result,
            userLocal: await this.modelUserLocal.findOne({
              where: { login: result.login },
              include: ['Roles'],
            }),
            userContact: await this.modelUserContact.findOne({
              where: { login: result.login },
            }),
          };
          data.auth = user;
          return true;
        } else {
          throw new UnauthorizedException(result as AuthUserError);
        }
      }
    }
    throw new UnauthorizedException({
      message: 'Пустой или неправильный токен',
    });
  }
}
