import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator as vValidator } from 'hono-openapi/valibot';
import { createFakeProblemRepository } from '../adapters/repository/fake-repositories';
import * as v from 'valibot';
import { ProblemSchema } from '../adapters/schema';

const problemRepo = createFakeProblemRepository(new Map());

const problemsRoutes = new Hono();

problemsRoutes.get('/problems',
  describeRoute({
    description:'모든 문제 목록을 반환합니다.',
    response:{
      200:{
        description:'Successful response',
        content:{
          'application/json':{
            schema: resolver(v.array(ProblemSchema))
          }
        }
      }
    }
  }),
  async (c) => {
    const problemList = await problemRepo.getAllProblemList();
    return c.json(problemList);
  }
);


problemsRoutes.post(
  '/problems',
  describeRoute({
    description: '새 문를 생성합니다',
    responses: {
      201: {
        description: 'Successfully created!',
      },
    },
  }),
  vValidator('json', ProblemSchema),
  async (c) => {
    const newProblem = c.req.valid('json');

    await problemRepo.createProblem({
      ...newProblem,
      createdAt: new Date(newProblem.createdAt),
      updatedAt: new Date(newProblem.updatedAt),
    });

    return new Response('', { status: 201 });
  }
);

export default problemsRoutes;