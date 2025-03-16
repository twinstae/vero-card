import { Hono } from 'hono';
import { openAPISpecs } from 'hono-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import cardsRoutes from './cards';
import problemsRoutes from './problems';

const app = new Hono();

 // "/cards"
app.route('/', cardsRoutes);
// "/problems"
app.route('/', problemsRoutes);

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '0.0.1',
        description: 'Greeting API',
      },
      servers: [{ url: 'http://localhost:3000', description: 'Local Server' }],
    },
  })
);

app.get(
  '/docs',
  apiReference({
    theme: 'saturn',
    spec: { url: '/openapi' },
  })
);

export default app;

Bun.serve({ fetch: app.fetch });
