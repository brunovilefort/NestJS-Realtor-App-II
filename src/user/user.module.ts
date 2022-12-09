import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { AuthController } from '@/user/auth/auth.controller';
import { AuthService } from '@/user/auth/auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
