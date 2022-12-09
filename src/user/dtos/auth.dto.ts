import {
  IsEmail,
  IsNotEmpty,
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
}
