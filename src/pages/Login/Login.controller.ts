import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
import { LoginService } from './Login.service';

@Controller('login')
@UseGuards(AuthGuard)
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @HttpCode(200)
  @Post()
  Login() {
    return this.loginService.login();
  }
}
