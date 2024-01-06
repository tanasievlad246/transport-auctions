import { Body, Controller, HttpException, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './auth.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.signUpUser(createUserDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }

  @Post('signin')
  async signIn(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { email, password } = loginUserDto;
      const token = await this.authService.signInUser(email, password);
      return res
        .cookie('jwt', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        })
        .sendStatus(200);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('signout')
  async signOut(@Res() res: Response) {
    return res.clearCookie('jwt').sendStatus(200);
  }
}
