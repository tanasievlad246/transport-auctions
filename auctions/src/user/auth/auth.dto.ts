import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'test@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'User password',
    type: String,
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
