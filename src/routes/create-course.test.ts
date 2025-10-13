import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { faker } from '@faker-js/faker';
import { makeAutheticatedUser } from '../tests/factories/make-user.ts';

test('create a course', async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser('manager')

  const response = await request(server.server)
    .post('/courses')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: faker.lorem.words(4), description: faker.lorem.words(10) });

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      courseId: expect.any(String),
    });
});

test('status 401 if user not manager', async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser('student')

  const response = await request(server.server)
    .post('/courses')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: faker.lorem.words(4), description: faker.lorem.words(10) });

    expect(response.status).toEqual(401)
})