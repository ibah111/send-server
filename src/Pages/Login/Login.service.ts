import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';

@Injectable()
export class LoginService {
  async login(auth: AuthResult) {
    if (auth.userContact) {
      return auth.user;
    } else {
      throw new UnauthorizedException({
        message: 'Вас нет в контакте',
        code: 'not_contact',
      });
    }
  }
}
