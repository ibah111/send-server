import { User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserSuccess } from 'src/Modules/Guards/auth.guard';

@Injectable()
export class LoginService {
  constructor(@InjectModel(User, 'contact') private ModelUser: typeof User) {}
  async login(user: AuthUserSuccess) {
    const OpUser = await this.ModelUser.findOne({
      where: { email: user.login },
    });
    if (OpUser) {
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Вас нет в контакте',
        code: 'not_contact',
      });
    }
  }
}
