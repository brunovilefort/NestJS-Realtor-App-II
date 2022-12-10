import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { HomeResponseDTO } from './dtos/home.dto';

type GetHomesInput = {
  city?: string;
  price?: { get?: number; lte?: number };
  propertyType?: PropertyType;
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: GetHomesInput): Promise<HomeResponseDTO[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        images: { select: { url: true }, take: 1 },
      },
      where: filters,
    });
    if (homes.length === 0) throw new NotFoundException();
    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new HomeResponseDTO(fetchHome);
    });
  }
}
