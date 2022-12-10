import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { UserType } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

type SignupInput = {
  name: string;
  phone: string;
  email: string;
  password: string;
};
type SigninInput = { email: string; password: string };

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ name, phone, email, password }: SignupInput) {
    const userExists = await this.prismaService.user.findUnique({ where: { email } });
    if (userExists) throw new ConflictException();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.prismaService.user.create({
      data: { name, phone, email, password: hashedPassword, user_type: UserType.BUYER },
    });
    return this.generateJWT(user.id, user.name);
  }

  async signin({ email, password }: SigninInput) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new HttpException('Invalid credentials', 400);
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) throw new HttpException('Invalid credentials', 400);
    return this.generateJWT(user.id, user.name);
  }

  private generateJWT(id: string, name: string) {
    return jwt.sign({ name, id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 12);
  }
}
