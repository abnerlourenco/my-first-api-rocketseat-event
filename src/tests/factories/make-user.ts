import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { hash } from "argon2";
import jwt from 'jsonwebtoken';
import { randomUUID as uuidv4 } from 'node:crypto'

export async function makeUser(role?: 'student' | 'manager') {
  const passwordBeforeHash = uuidv4()

  const result = await db.insert(users).values({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await hash(passwordBeforeHash),
    role,
  }).returning();

  return {
    user: result[0],
    passwordBeforeHash
  }
}

export async function makeAutheticatedUser(role?: 'student' | 'manager') {
  const { user } = await makeUser(role)

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required.');
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

  return { user, token }
}