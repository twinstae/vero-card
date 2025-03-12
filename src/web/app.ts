import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator as vValidator } from 'hono-openapi/valibot';
import * as v from 'valibot';
import { createFakeCardRepository } from '../adapters/repository/fake-repositories';
import { CardSchema } from '../adapters/schema';
import { apiReference } from '@scalar/hono-api-reference'

const cardRepo = createFakeCardRepository(new Map());

const app = new Hono();

app.get(
  '/cards',
  describeRoute({
    description: '모든 카드 목록을 반환합니다',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: resolver(
              v.array(CardSchema)
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const cardList = await cardRepo.getAllCardList();
    return c.json(cardList);
  }
);

app.post(
    '/cards',
    describeRoute({
      description: '새 카드를 생성합니다',
      responses: {
        201: {
          description: 'Successfully created!',
        },
      },
    }),
    vValidator('json', CardSchema),
    async (c) => {
      const newCard = c.req.valid('json')
      
      await cardRepo.createCard({
        ...newCard,
        createdAt: new Date(newCard.createdAt)
      });

      return c.status(201);
    }
)

import { openAPISpecs } from 'hono-openapi'

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '0.0.1',
        description: 'Greeting API',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
      ],
    },
  })
)


app.get(
  '/docs',
  apiReference({
    theme: 'saturn',
    spec: { url: '/openapi' },
  })
)

Bun.serve({ fetch: app.fetch });