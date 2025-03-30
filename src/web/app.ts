import { Hono } from 'hono';
import { describeRoute, openAPISpecs } from 'hono-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import cardsRoutes from './cards';
import problemsRoutes, { proficiencyLevelRepo } from './problems';
import { resolver } from 'hono-openapi/valibot';
import * as v from 'valibot';
import { dateStringSchema } from '../adapters/schema';

const app = new Hono();

// "/cards"
app.route('/', cardsRoutes);

// "/problems"
app.route('/', problemsRoutes);

// "/learners/:learnerId/learning-histories"
// app.route('/', problemsRoutes);


app.get("/learners/:learnerId/proficiency-levels",
  describeRoute({
    description: '어떤 학습자의 숙련도 레벨 목록을 가져옵니다.',
    response:{
      200:{
        description:'Successful response',
        content:{
          'application/json':{
            schema: resolver(v.array(v.object({
              learnerId: v.string(),
                cardId: v.string(),
                value: v.picklist([0,1,2,3,4,5]),
                updatedAt: dateStringSchema
            })))
          }
        }
      }
    }
  }),
  async (c) => {
    const testLearnerId = "twinstae";
    const levelList = await proficiencyLevelRepo.getProficiencyLevelListByLearnerId(testLearnerId);
    return c.json(levelList);
  }
);


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
