import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '@/user/auth';
import { SigninDTO, SignupDTO } from '@/user/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDTO) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDTO) {
    return this.authService.signin(body);
  }
}
