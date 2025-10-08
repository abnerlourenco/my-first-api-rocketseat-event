import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";

export async function makeUser(userId?: string) {
  const result = await db.insert(users).values({
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }).returning();

  return result[0];
}