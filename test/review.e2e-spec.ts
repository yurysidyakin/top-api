import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types, disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();

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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
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

  it('/api/review/byProduct/:productId (GET) – success', async () => {
    return request(app.getHttpServer())
      .get('/api/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: { body: { _id: string } }) => {
        expect(body._id);
      });
  });

  it('/api/review/byProduct/:productId (GET) – fail', async () => {
    return request(app.getHttpServer())
      .get('/api/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200)
      .then(({ body }: { body: { _id: string } }) => {
        expect(body._id).toBeUndefined();
      });
  });

  it('/api/review/:id (DELETE) – success', () => {
    return request(app.getHttpServer())
      .delete('/api/review/' + createdId)
      .expect(200);
  });

  it('/api/review/:id (DELETE) – fail', () => {
    return request(app.getHttpServer())
      .delete('/api/review/' + new Types.ObjectId().toHexString())
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(async () => {
    await disconnect();
  });
});
