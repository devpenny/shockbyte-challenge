import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // Create a mocks of all types of data the app needs to run

  // only implementing if i get some time left, since im unit testing
  // every layer of the app already it should be fine for now.

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/data (GET)', () => {
    return request(app.getHttpServer()).get('/data').expect(200);
  });

  // it('/data (POST)', async () => {
  //   return await request(app.getHttpServer())
  //     .post('/data')
  //     .send(mockCreateDataDTO)
  //     .expect(201);
  // });

  // it('/data/id (GET)', async () => {
  //   await request(app.getHttpServer()).post('/data').send(mockCreateDataDTO);
  //   return await request(app.getHttpServer()).get('/data/1').expect(200);
  // });
});
