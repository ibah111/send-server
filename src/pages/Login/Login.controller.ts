import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, AuthUserSuccess } from 'src/utils/auth.guard';
import { LoginService } from './Login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @HttpCode(200)
  @Post()
  Login(@Auth() user: AuthUserSuccess) {
    return this.loginService.login(user);
  }
}
