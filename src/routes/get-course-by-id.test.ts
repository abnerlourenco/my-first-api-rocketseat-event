import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';
import { randomUUID as uuidv4 } from 'node:crypto';
import { makeAutheticatedUser } from '../tests/factories/make-user.ts';

test('get course by id', async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser('student')

  const course = await makeCourse();

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', token)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String) || null,
    }
  })
})

test('returning 404 for non existing courses', async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser('student')

  const response = await request(server.server)
    .get(`/courses/${uuidv4()}`)
    .set('Authorization', token)

  expect(response.status).toEqual(404)
})