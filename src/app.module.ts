import { Module } from '@nestjs/common';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';
import { HomeModule } from '@/home/home.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from '@/user/interceptors';
import { AuthGuard } from '@/guards';

@Module({
  imports: [PrismaModule, UserModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
