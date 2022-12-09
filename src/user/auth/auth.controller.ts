import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '@/user/auth';
import { SignupDTO } from '@/user/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDTO) {
    return this.authService.signup(body);
  }
}
