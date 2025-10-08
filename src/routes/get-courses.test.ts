import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';
import { randomUUID } from 'node:crypto';
import { makeEnrollments } from '../tests/factories/make-enrollments.ts';
import { makeUser } from '../tests/factories/make-user.ts';

test('get courses', async () => {
  await server.ready();

  const titleId = randomUUID();
  
  const course = await makeCourse(titleId);
  const user = await makeUser();
  
  await makeEnrollments( user.id , course.id );
  

  const response = await request(server.server)
    .get(`/courses?search=${titleId}`)

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