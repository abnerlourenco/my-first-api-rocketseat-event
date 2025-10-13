import { expect, test } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { makeUser } from '../tests/factories/make-user.ts';
import { verify } from "argon2";

test('login', async () => {
  await server.ready();

  const { user, passwordBeforeHash } = await makeUser();

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email,
      password: passwordBeforeHash
    });

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
      message: 'Login sucessful'
    })
})

test('status 400 if email incorrect', async () => {
  await server.ready();

  const { passwordBeforeHash } = await makeUser();

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-Type', 'application/json')
    .send({
      email: "email@incorrect.test",
      password: passwordBeforeHash
    });

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      message: 'Invalid credentials',
    })
})


test('status 400 if password incorrect', async () => {
  await server.ready();

  const { user } = await makeUser();

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email,
      password: "senha incorreta"
    });

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      message: 'Invalid credentials',
    })
})