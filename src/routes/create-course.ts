import { type FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { courses } from '../database/schema.ts';
import { db } from '../database/client.ts';
import z from 'zod';
import { checkRequestJWT } from './hooks/check-request-jwt.ts';
import { checkUserRole } from './hooks/check-user-role.ts';

export const createCourseRoute: FastifyPluginCallbackZod = async(server) => {
  server.post('/courses', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['Courses'],
      summary: 'Create a new course',
      body: z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
      response: {
        201: z.object({ courseId: z.uuid() }).describe('Successfully created course'),
      }
    }
  }, async (request, reply) => {

    const { title, description } = request.body;

    const result = await db.insert(courses).values({ 
      title, 
      description 
    }).returning();

    return reply.status(201).send({ courseId: result[0].id });
  })
}