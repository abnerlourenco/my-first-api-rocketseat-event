import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { StringFormatParams } from "zod/v4/core";

export async function makeCourse(title?: string) {
  const result = await db.insert(courses).values({
    title: title ?? faker.lorem.words(4),
    description: faker.lorem.words(10),
  }).returning();

  return result[0];
}