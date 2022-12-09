import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserType } from '@prisma/client';
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

  async signup({ name, phone, email, password }: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) throw new ConflictException();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });
    const token = jwt.sign({ name, id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  }
}
