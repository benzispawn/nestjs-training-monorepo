import t from 'tap';
import request from 'supertest';
import { App as SupertestApp } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

void t.test('GET /health returns application health', async (t) => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  await app.init();
  const server = app.getHttpServer() as SupertestApp;

  const response = await request(server).get('/health');

  t.equal(response.status, 200);
  t.same(response.body, {
    status: 'ok',
    service: '01-nest-basics',
  });

  await app.close();
});
