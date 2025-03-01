import { Module } from '@nestjs/common';
import { LoginController } from './Login.controller';
import { LoginService } from './Login.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
