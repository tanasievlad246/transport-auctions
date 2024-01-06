import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUpUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userService.create(createUserDto);
      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error.message);
    }
  }

  async signInUser(email: string, password: string): Promise<string> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.userService.comparePassword(
      user,
      password,
    );
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      cretedAt: user.createdAt,
      isActive: user.is_active,
    };
    return this.jwtService.sign(payload);
  }
}
