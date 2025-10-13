import { expect, test } from "vitest";
import { server } from "../app.ts";
import request from "supertest";
import { makeEnrollments } from "../tests/factories/make-enrollments.ts";
import { makeAutheticatedUser } from "../tests/factories/make-user.ts";
import { makeCourse } from "../tests/factories/make-course.ts";


test('Create an enrollment', async() => {
  await server.ready();

  const { user, token } = await makeAutheticatedUser('student');

  const course = await makeCourse();

  const response = await request(server.server)
    .post('/enrollments')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({
      courseId: course.id,
      userId: user.id,
    });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    enrollmentId: expect.any(String),
  })

})

test('status 400 if user already enrolled in course', async() => {
  await server.ready();

  const { user, token } = await makeAutheticatedUser('student');

  const course = await makeCourse();

  await makeEnrollments(user.id, course.id);

  const response = await request(server.server)
    .post('/enrollments')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({
      courseId: course.id,
      userId: user.id,
    });

  console.log(response)
})