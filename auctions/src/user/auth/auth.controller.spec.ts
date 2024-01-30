import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const TEST_EMAIL = 'test@email.com';
  const TEST_PASSWORD = 'password';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        AuthService,
        {
          provide: UserService,
          useValue: () => {
            return {
              create: (createUserDto: CreateUserDto) => {
                return {
                  id: 1,
                  ...createUserDto,
                };
              },
              findOne: () => {
                return {
                  id: 1,
                  email: TEST_EMAIL,
                  password: TEST_PASSWORD,
                  firstName: 'Test',
                  lastName: 'User',
                  createdAt: new Date(),
                  auctions: [],
                  bids: [],
                };
              },
              comparePassword: (user: User, password: string) => {
                return user.password === password;
              },
            };
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up a user', async () => {
    const user = await controller.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      firstName: 'Test',
      lastName: 'User',
    });
    expect(user).toBeDefined();
    expect(user.email).toEqual(TEST_EMAIL);
    expect(user.password).not.toEqual(TEST_PASSWORD);
  });

  it('should sign in a user', async () => {
    const loginUserDto = { email: 'test@example.com', password: 'password123' };
    const token = 'generated-jwt-token';
    const responseMock = {
      cookie: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    };

    jest.spyOn(authService, 'signInUser').mockResolvedValue(token);

    await controller.signIn(loginUserDto, responseMock as any);

    expect(authService.signInUser).toHaveBeenCalledWith(
      loginUserDto.email,
      loginUserDto.password,
    );
    expect(responseMock.cookie).toHaveBeenCalledWith(
      'jwt',
      token,
      expect.anything(),
    );
    expect(responseMock.sendStatus).toHaveBeenCalledWith(200);
  });

  it('should sign out a user', async () => {
    const responseMock = {
      clearCookie: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    };

    await controller.signOut(responseMock as any);

    expect(responseMock.clearCookie).toHaveBeenCalledWith('jwt');
    expect(responseMock.sendStatus).toHaveBeenCalledWith(200);
  });
});
