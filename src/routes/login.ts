import { type FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { users } from '../database/schema.ts';
import { db } from '../database/client.ts';
import jwt from 'jsonwebtoken';
import z from 'zod';
import { eq } from 'drizzle-orm';
import { verify } from 'argon2';

export const loginRoute: FastifyPluginCallbackZod = async(server) => {
  server.post('/sessions', {
    schema: {
      tags: ['auth'],
      summary: 'login',
      body: z.object({
        email: z.email(),
        password: z.string(),
      }),
      response: {
        200: z.object({
          token: z.string(),
          message: z.string()
        }),
        400: z.object({ message: z.string() })
      }
    }
  }, async (request, reply) => {

    const { email, password } = request.body;

    const result = await db.select().from(users).where(eq(users.email, email))
    
    if(result.length === 0) {
      return reply.status(400).send({ message: 'Invalid credentials' });
    }

    const user = result[0];

    const doesPasswordMatch = await verify(user.password, password);
    
    if(!doesPasswordMatch) {
      return reply.status(400).send({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_TOKEN not to be configured')
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

    return reply.status(200).send({ token, message: 'Login sucessful' });
  })
}