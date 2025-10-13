import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';
import { randomUUID } from 'node:crypto';
import { makeEnrollments } from '../tests/factories/make-enrollments.ts';
import { makeAutheticatedUser } from '../tests/factories/make-user.ts';

test('get courses', async () => {
  await server.ready();

  const titleId = randomUUID();

  const { token, user } = await makeAutheticatedUser('manager');
  
  const course = await makeCourse(titleId);
  
  await makeEnrollments( user.id , course.id );
  
  const response = await request(server.server)
    .get(`/courses?search=${titleId}`)
    .set('Authorization', token )

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      courses: [
        { 
          id: expect.any(String),
          title: expect.any(String),
          description: expect.any(String) || null,
          enrollments: 1
        }
      ],
      total: 1,
    })
})

test('status 401 if user not manager', async () => {
  await server.ready();

  const { token } = await makeAutheticatedUser('student')

  const response = await request(server.server)
    .get(`/courses`)
    .set('Autorization', token )

    expect(response.status).toEqual(401)
})