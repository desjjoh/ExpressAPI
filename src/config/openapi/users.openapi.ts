import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { CreateUserSchema, UpdateUserSchema, UserResponseSchema } from '@/schemas/user.schema';
import { UserIdSchema } from '@/schemas/id.schema';

export function registerUserPaths(registry: OpenAPIRegistry) {
  registry.register('User', UserResponseSchema);
  registry.register('CreateUser', CreateUserSchema);
  registry.register('UserId', UserIdSchema);
  registry.register('UpdateUser', UpdateUserSchema);

  // GET /users
  registry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['Users'],
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
    request: {
      body: {
        content: {
          'application/json': { schema: CreateUserSchema },
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

  // PUT /users/{id}
  registry.registerPath({
    method: 'put',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Update a single user',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', example: 1 },
      },
    ],
    request: {
      body: {
        content: {
          'application/json': { schema: UpdateUserSchema },
        },
      },
    },
    responses: {
      200: {
        description: 'User updated',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' },
          },
        },
      },
      404: { description: 'User not found' },
    },
  });

  // DELETE /users/{id}
  registry.registerPath({
    method: 'delete',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Delete a single user',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', example: 1 },
      },
    ],
    responses: {
      204: { description: 'User deleted successfully (no content)' },
      404: { description: 'User not found' },
    },
  });
}
