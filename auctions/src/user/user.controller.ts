import {
  Controller,
  // Get,
  // Body,
  // Patch,
  // Param,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';

@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Patch(':email')
  // update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(email, updateUserDto);
  // }

  // @Delete(':email')
  // remove(@Param('email') email: string) {
  //   return this.userService.remove(email);
  // }
}
