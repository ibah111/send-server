import { User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { LoginController } from './Login.controller';
import { LoginService } from './Login.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
