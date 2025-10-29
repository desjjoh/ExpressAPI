import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { env } from '@/config/env-validation';
import { registerUserPaths } from './users.openapi';

const registry = new OpenAPIRegistry();

registerUserPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'QuickAPI Express',
    version: '1.0.0',
    description: 'Auto-generated documentation from Zod schemas',
  },
  servers: [{ url: `http://localhost:${env.PORT}` }],
});
