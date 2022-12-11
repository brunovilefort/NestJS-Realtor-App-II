import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

import { PrismaService } from '@/prisma/prisma.service';
import { UserInfo } from '@/user/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [context.getHandler, context.getClass]);
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const payload = (await jwt.verify(token, process.env.JWT_SECRET)) as UserInfo;
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id.toString() },
        });
        if (!user) return false;
        if (roles.includes(user.user_type)) return true;
        return false;
      } catch {
        return false;
      }
    }
    return true;
  }
}
