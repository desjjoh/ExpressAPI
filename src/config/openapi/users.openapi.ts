import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { CreateUserSchema, UserResponseSchema } from '@/schemas/user.schema';
import { UserIdSchema } from '@/schemas/id.schema';

export function registerUserPaths(registry: OpenAPIRegistry) {
  registry.register('User', UserResponseSchema);
  registry.register('CreateUser', CreateUserSchema);
  registry.register('UserId', UserIdSchema);

  // GET /users
  registry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['Users'],
    summary: 'Get a list of users',
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
          },
        },
      },
    },
  });

  // POST /users
  registry.registerPath({
    method: 'post',
    path: '/users',
    tags: ['Users'],
    summary: 'Create a new user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreateUser' },
        },
      },
    },
    responses: {
      201: {
        description: 'User created',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' },
          },
        },
      },
    },
  });

  // GET /users/{id}
  registry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Get a single user',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { $ref: '#/components/schemas/UserId' },
      },
    ],
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' },
          },
        },
      },
      404: { description: 'User not found' },
    },
  });
}
