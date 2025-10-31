import fastify from 'fastify';
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform
} from 'fastify-type-provider-zod';

import fastifySwagger from '@fastify/swagger';
import { createCourseRoute } from './routes/create-course.ts';
import { getCourseByIdRoute } from './routes/get-course-by-id.ts';
import { getCoursesRoute } from './routes/get-courses.ts';
import scalarAPIReference from '@scalar/fastify-api-reference'
import { loginRoute } from './routes/login.ts';
import { createEnrollmentRoute } from './routes/create-enrollment.ts';

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Desafio Node.js - My First API',
        description: 'API criada no evento My First API da Rocketseat',
        version: '1.0.0'
      }
    },
    transform: jsonSchemaTransform,
  })
  
  server.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'deepSpace'
    }
  });
}


server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(createCourseRoute);
server.register(getCourseByIdRoute);
server.register(getCoursesRoute);
server.register(loginRoute);
server.register(createEnrollmentRoute);


export { server };