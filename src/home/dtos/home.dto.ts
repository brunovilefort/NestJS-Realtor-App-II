import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDTO {
  id: number;
  address: string;
  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBadrooms() {
    return this.number_of_bedrooms;
  }
  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  image: string;
  city: string;
  @Exclude()
  listed_date: Date;
  price: number;
  @Exclude()
  land_size: number;
  propertyType: PropertyType;
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: string;

  constructor(partial: Partial<HomeResponseDTO>) {
    Object.assign(this, partial);
  }
}

class ImageDTO {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDTO {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  landSize: number;
  @IsEnum(PropertyType)
  propertyType: PropertyType;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  images: ImageDTO[];
}

export class UpdateHomeDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}
