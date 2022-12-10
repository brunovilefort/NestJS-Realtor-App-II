import { Body, Controller, Param, Post } from '@nestjs/common';

import { AuthService } from '@/user/auth';
import { GenerateProductKeyDTO, SigninDTO, SignupDTO } from '@/user/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  signup(@Body() body: SignupDTO) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDTO) {
    return this.authService.signin(body);
  }

  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDTO) {
    return this.authService.generateProductKey(email, userType);
  }
}
