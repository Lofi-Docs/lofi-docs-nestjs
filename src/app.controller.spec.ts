import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello! Lofi-Docs API"', () => {
      expect(appController.getHello()).toBe('Hello! Lofi-Docs API');
    });
  });

  describe('health', () => {
    it('should return health message with correct port', () => {
      expect(appController.getHealth()).toBe(
        `OK Lofi-Docs Server is running on port ${process.env.PORT ?? 3000}`,
      );
    });
  });
});
