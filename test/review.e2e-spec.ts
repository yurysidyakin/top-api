import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: 'a@a.ru',
  password: '1',
};

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Title',
  description: 'Description',
  rating: 5,
  productId,
};

describe('AppController (e2e)', () => {
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

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    token = body.access_token;
  });

  it('/api/review/create (POST) – success', async () => {
    return request(app.getHttpServer())
      .post('/api/review/create/')
      .send(testDto)
      .expect(201)
      .then(({ body }: { body: { _id: string } }) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/api/review/create (POST) – fail', () => {
    return request(app.getHttpServer())
      .post('/api/review/create/')
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/api/review/byProduct/:productId (GET) – success', async () => {
    return request(app.getHttpServer())
      .get('/api/review/byProduct/' + productId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/api/review/byProduct/:productId (GET) – fail', async () => {
    return request(app.getHttpServer())
      .get('/api/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(401) // Ожидаем 401, так как токен не передан
      .then(({ body }: request.Response) => {
        expect(body).toEqual({
          message: 'Unauthorized',
          statusCode: 401,
        });
      });
  });

  it('/api/review/:id (DELETE) – success', () => {
    if (!createdId) {
      throw new Error(
        'createdId не определён. Убедитесь, что тест на создание отзыва выполнен успешно.',
      );
    }
    return request(app.getHttpServer())
      .delete('/api/review/' + createdId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/api/review/:id (DELETE) – fail', () => {
    return request(app.getHttpServer())
      .delete('/api/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(async () => {
    await disconnect();
  });
});
