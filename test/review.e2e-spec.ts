import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

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

  afterAll(async () => {
    await app.close();
  });

  it('/api/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: { body: { _id: string } }) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });
});
