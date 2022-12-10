import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @Matches(/^(\d{2})\D*(\d{5}|\d{4})\D*(\d{4})$/, {
    message: 'phone must be a valid phone number.',
  })
  phone: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(4)
  password: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productKey?: string;
}

export class SigninDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class GenerateProductKeyDTO {
  @IsEmail()
  email: string;
  @IsEnum(UserType)
  userType: UserType;
}
