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
import { PropertyType } from '@prisma/client';
import { CreateHomeDTO, HomeResponseDTO, UpdateHomeDTO } from '@/home/dtos';
import { User } from '@/user/decorators';
import { UserInfo } from '@/user/interfaces';

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

  @Post()
  createHome(@Body() body: CreateHomeDTO, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }

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

  @Delete(':id')
  async deleteHome(@Param('id', ParseIntPipe) id: number, @User() user: UserInfo) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id.toString()) throw new UnauthorizedException();
    return this.homeService.deleteHomeById(id);
  }
}
