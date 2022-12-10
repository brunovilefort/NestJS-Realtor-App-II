import { PropertyType } from '@prisma/client';

export const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  propertyType: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
};

export interface GetHomesInput {
  city?: string;
  price?: { get?: number; lte?: number };
  propertyType?: PropertyType;
}
