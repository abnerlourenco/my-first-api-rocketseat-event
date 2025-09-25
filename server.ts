import fastify from 'fastify';
import crypto from 'node:crypto';

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
});

const courses = [
  { id: '1', name: 'Course 1' },
  { id: '2', name: 'Course 2' },
  { id: '3', name: 'Course 3' },
]

server.get('/', (request, reply) => {
  return reply.status(200).send('Hello World!');
})

server.get('/users', (request, reply) => {
  const users = [
    {name: 'John', email: 'john@example.com'},
    {name: 'Jane', email: 'jane@example.com'},
  ]

  return reply.status(200).send({ users })
})

server.get('/courses', (request, reply) => {
  return reply.send({ courses })
})

server.get('/courses/:id', (request, reply) => {
  type  Params = {
    id: string
  }

  const params = request.params as Params

  const courseId = params.id

  const course = courses.find(course => course.id === courseId)

  if (!course) {
    return reply.status(404).send({ message: 'Course not found' })
  }

  return reply.send(course);
})

server.listen( { port: 3333 } ).then(() => {
  console.log('Server is running in port:3333');
})