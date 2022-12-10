import { Exclude, Expose } from 'class-transformer';

import { PropertyType } from '@prisma/client';

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
