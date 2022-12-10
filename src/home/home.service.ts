import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { HomeResponseDTO } from './dtos/home.dto';

type GetHomesInput = {
  city?: string;
  price?: { get?: number; lte?: number };
  propertyType?: PropertyType;
};

type CreateHomeInput = {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
};

type UpdateHomeInput = {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
};

export const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  propertyType: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
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
}
