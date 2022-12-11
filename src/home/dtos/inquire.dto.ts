import { IsNotEmpty, IsString } from 'class-validator';

export class InquireDTO {
  @IsNotEmpty()
  @IsString()
  message: string;
}
