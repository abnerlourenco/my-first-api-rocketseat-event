import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { server } from "../app.ts";
import z from "zod";
import { db } from "../database/client.ts";
import { enrollments } from "../database/schema.ts";
import { and, eq } from "drizzle-orm";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request.ts";


export const createEnrollmentRoute: FastifyPluginCallbackZod = async() => {
  server.post('/enrollments', {
    preHandler: [
      checkRequestJWT,
    ],
    schema: {
      tags: ['Enrollments'],
      summary: 'Create a new enrollment',
      body: z.object({
        courseId: z.uuid(),
      }),
      response: {
        201: z.object({
          enrollmentId: z.string()
        }).describe('Enrollment created'),
        400: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    
    const user = getAuthenticatedUserFromRequest(request)

    const { courseId } = request.body;

    const existsEnrollment = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(and(eq(enrollments.userId, user.sub), eq(enrollments.courseId, courseId)))
      .limit(1);

    if (existsEnrollment.length > 0) {
      return reply.status(400).send({ message: 'User already enrolled in this course' });
    }

    const result = await db.insert(enrollments).values({
      courseId,
      userId: user.sub
    }).returning();
    
    return reply.status(201).send({ enrollmentId: result[0].id })
  })
}
