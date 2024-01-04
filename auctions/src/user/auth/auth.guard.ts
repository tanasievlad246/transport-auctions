import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const cookie = this.extractTokenFromCookie(request);
      const payload = await this.jwtService.verifyAsync(cookie, {
        secret: process.env.JWT_KEY,
      });
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromCookie(request: Request): string {
    const cookieList = request.headers.cookie.split(';');
    const jwtCookie = cookieList
      .find((cookie) => cookie.startsWith('jwt='))
      .replace('jwt=', '');
    return jwtCookie;
  }
}
