import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Body,
  UnauthorizedException,
} from '@nestjs/common';

import { HomeService } from '@/home/home.service';
import { CreateHomeDTO, HomeResponseDTO, InquireDTO, UpdateHomeDTO } from '@/home/dtos';
import { PropertyType, UserType } from '@prisma/client';
import { UserInfo } from '@/user/interfaces';
import { User } from '@/user/decorators';
import { Roles } from '@/decorators';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDTO[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDTO, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id.toString()) throw new UnauthorizedException();
    return this.homeService.updateHomeById(id, body);
  }

  @Roles(UserType.ADMIN, UserType.REALTOR)
  @Delete(':id')
  async deleteHome(@Param('id', ParseIntPipe) id: number, @User() user: UserInfo) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id.toString()) throw new UnauthorizedException();
    return this.homeService.deleteHomeById(id);
  }

  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() { message }: InquireDTO,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }
}
