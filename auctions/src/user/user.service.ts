import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, email } = createUserDto;

      const existingUser = await this.userRepository.findOneBy({ email });

      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const newUser = this.userRepository.create(createUserDto);

      const { salt, hash } = await this.hashPassword(password);

      newUser.salt = salt;
      newUser.password = hash;

      const savedUser = await this.userRepository.save(newUser);

      return savedUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }

  private async hashPassword(
    password: string,
  ): Promise<{ salt: string; hash: string }> {
    return new Promise((resolve, reject) => {
      try {
        const _salt = crypto.randomBytes(32).toString('hex');
        const hash = crypto.pbkdf2Sync(password, _salt, 10000, 64, 'sha512');
        resolve({
          salt: _salt,
          hash: hash.toString('hex'),
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const hash = crypto
          .pbkdf2Sync(password, user.salt, 10000, 64, 'sha512')
          .toString('hex');
        resolve(hash === user.password);
      } catch (error) {
        reject(error);
      }
    });
  }

  async findAll() {
    return this.userRepository.find({
      select: ['email', 'firstName', 'lastName', 'createdAt'],
    });
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['auctions', 'bids'],
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async remove(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return this.userRepository.softDelete(user);
  }
}
