import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { HomeResponseDTO } from '@/home/dtos';
import { GetHomesInput, homeSelect, CreateHomeInput, UpdateHomeInput } from '@/home/interfaces';

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

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        ...homeSelect,
        images: { select: { url: true } },
        realtor: { select: { name: true, email: true, phone: true } },
      },
    });
    if (!home) throw new NotFoundException();
    return new HomeResponseDTO(home);
  }

  async createHome({
    address,
    numberOfBedrooms,
    numberOfBathrooms,
    city,
    price,
    landSize,
    propertyType,
    images,
  }: CreateHomeInput) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        city,
        price,
        land_size: landSize,
        propertyType,
        realtor_id: '4',
      },
    });
    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });
    await this.prismaService.image.createMany({ data: homeImages });
    return new HomeResponseDTO(home);
  }

  async updateHomeById(id: number, data: UpdateHomeInput) {
    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) throw new NotFoundException();
    const updatedHome = await this.prismaService.home.update({ where: { id }, data });
    return new HomeResponseDTO(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({ where: { home_id: id } });
    await this.prismaService.home.delete({ where: { id } });
  }
}
