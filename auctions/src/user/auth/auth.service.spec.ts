import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { User } from '../entities/user.entity';

jest.mock('@nestjs/jwt');
jest.mock('../user.service');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    // const mockJwtService = {
    //   sign: jest.fn(),
    // };

    // const mockUserService = {
    //   create: jest.fn(),
    //   findOne: jest.fn(),
    //   comparePassword: jest.fn(),
    // };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUpUser', () => {
    it('should successfully sign up a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        // Add other required fields as per CreateUserDto
      };
      const expectedUser: User = {
        ...createUserDto,
        salt: 'somesalt',
        is_active: true,
        passwordResetToken: null,
        confirmationToken: null,
        createdAt: new Date(),
        auctions: [],
        bids: [],
        // Include other properties that are expected to be in the returned user object
      };

      userService.create.mockResolvedValue(expectedUser);

      const result = await service.signUpUser(createUserDto);
      expect(result).toEqual(expectedUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    // Add more tests for failure scenarios if necessary
  });

  describe('signInUser', () => {
    it('should successfully sign in a user and return a token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user: User = {
        email,
        password,
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        is_active: true,
        salt: 'somesalt',
        passwordResetToken: null,
        confirmationToken: null,
        auctions: [],
        bids: [],
      };
      const token = 'jwtToken';

      userService.findOne.mockResolvedValue(user);
      userService.comparePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue(token);

      const result = await service.signInUser(email, password);
      expect(result).toEqual(token);
      expect(userService.findOne).toHaveBeenCalledWith(email);
      expect(userService.comparePassword).toHaveBeenCalledWith(user, password);
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw an error if user does not exist', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        service.signInUser('nonexistent@example.com', 'password'),
      ).rejects.toThrow(HttpException);
    });

    // Add more tests for other failure scenarios, like invalid password
  });
});
