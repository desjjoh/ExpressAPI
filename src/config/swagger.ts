import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from '@/config/openapi';

export const swaggerDocs = [swaggerUi.serve, swaggerUi.setup(openApiSpec)];
