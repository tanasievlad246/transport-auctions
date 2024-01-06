import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The user email',
    type: String,
    example: 'test@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'The user first name',
    type: String,
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty({
    description: 'The user last name',
    type: String,
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty({
    description: 'The user password',
    type: String,
    example: 'Password123!',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  password: string;
}
