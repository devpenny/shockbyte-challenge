import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  const mockLoginDTO = {
    username: 'username',
    password: 'password',
  };

  const mockAuthService = {
    login: jest.fn().mockResolvedValue('mockAccessToken'),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('login', () => {
    it('should return be able to login succesfully', async () => {
      expect(await appController.login(mockLoginDTO)).toEqual(
        'mockAccessToken',
      );
    });
  });
});
