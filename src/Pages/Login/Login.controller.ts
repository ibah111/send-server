import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { LoginService } from './Login.service';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('login')
@UseGuards(AuthGuard)
@ApiBasicAuth()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @HttpCode(200)
  @Post()
  Login(@Auth() auth: AuthResult) {
    return this.loginService.login(auth);
  }
}
