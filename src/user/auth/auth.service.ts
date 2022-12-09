import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '@/prisma/prisma.service';

type SignupParams = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email, password }: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) throw new ConflictException();
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(userExists);
  }
}
