import { User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserSuccess } from 'src/utils/auth.guard';

@Injectable()
export class LoginService {
  constructor(@InjectModel(User) private ModelUser: typeof User) {}
  async login(user: AuthUserSuccess) {
    const OpUser = await this.ModelUser.findOne({
      where: { email: user.login },
    });
    if (OpUser) {
      return 'Ok';
    } else {
      throw new UnauthorizedException({
        message: 'Вас нет в контакте',
        code: 'not_contact',
      });
    }
  }
}
