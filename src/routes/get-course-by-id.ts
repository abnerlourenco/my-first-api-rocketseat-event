import { type FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { courses } from '../database/schema.ts';
import { db } from '../database/client.ts';
import z from 'zod';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUserFromRequest } from '../utils/get-authenticated-user-from-request.ts';
import { checkUserRole } from './hooks/check-user-role.ts';
import { checkRequestJWT } from './hooks/check-request-jwt.ts';

export const getCourseByIdRoute: FastifyPluginCallbackZod = async(server) => {
  server.get('/courses/:id', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('student'),
    ],
    schema: {
      tags: ['Courses'],
      summary: 'Get course by ID',
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable(),
          })
        }),
        404: z.null().describe('Curse not found')
      }
    }
  }, async (request, reply) => {

    const courseId = request.params.id

    const result = await db.select().from(courses).where(eq(courses.id, courseId));

    if (result.length > 0) {
      return reply.send({ course: result[0] });
    }
    
    return reply.status(404).send()
  })
}