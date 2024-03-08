import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn((createUserDto: CreateUserDto) => {
        const user: User = new User();
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.passwordResetToken = null;
        user.auctions = [];
        user.bids = [];
        user.is_active = true;
        user.confirmationToken = null;
        user.salt = 'salt';
        return user;
      }),
      save: jest.fn(),
      findOne: jest.fn((): User => {
        return {
          email: 'test@email.com',
          password: 'aH1asjkhdjkaghsuikjgrtuiyqgt', //password hash
          firstName: 'John',
          lastName: 'Doe',
          passwordResetToken: null,
          auctions: [],
          bids: [],
          is_active: true,
          confirmationToken: null,
          salt: 'salt',
          createdAt: new Date(),
        };
      }),
      findOneBy: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = {
      email: 'test@email.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    const user: User = await service.create(userDto);

    expect(user).toBeDefined();
    expect(user.email).toBe(userDto.email);
    expect(user.firstName).toBe(userDto.firstName);
    expect(user.lastName).toBe(userDto.lastName);
    expect(user.password).not.toBe(userDto.password);
  });

  it('should correctly compare passwords', async () => {
    const userDto: CreateUserDto = {
      email: 'test@email.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    const user: User = await service.create(userDto);

    expect(await service.comparePassword(user, userDto.password)).toBe(true);
  });

  it('should find all users', async () => {
    const users: User[] = await service.findAll();

    expect(users).toBeDefined();
  });

  it('should find one user', async () => {
    const email = 'test@email.com';
    const user: User = await service.findOne(email);

    expect(user).toBeDefined();
    expect(user.email).toBe(email);
  });

  it('should update a user', async () => {
    const user: User = await service.findOne('test@email.com');
    const updateUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
    };
    expect((await service.update(user.email, updateUserDto)).firstName).toBe(
      updateUserDto.firstName,
    );
  });
});
