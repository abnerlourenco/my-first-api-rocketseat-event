import { type FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { courses } from '../database/schema.ts';
import { db } from '../database/client.ts';
import z from 'zod';

export const getCoursesRoute: FastifyPluginCallbackZod = async(server) => {
  server.get('/courses',{
    schema: {
      tags: ['Courses'],
      summary: 'Get all courses',
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable(),
          }))
        })
      }
    }
  }, async (request, reply) => {
    const result = await db.select().from(courses);
  
    return reply.send({ courses: result });
  })
}