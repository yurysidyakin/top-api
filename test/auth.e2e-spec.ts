import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const loginDto: AuthDto = {
  login: 'a@a.ru',
  password: '1',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/auth/login (POST) – success', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/api/auth/login (POST) – fail password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ ...loginDto, password: '2' })
      .expect(401, {
        message: 'Не верный пароль',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/api/auth/login (POST) – fail login', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ ...loginDto, login: 'aaa@a.ru' })
      .expect(401, {
        statusCode: 401,
        message: 'Пользователь с таким email не найден',
        error: 'Unauthorized',
      });
  });

  afterAll(async () => {
    await disconnect();
  });
});
