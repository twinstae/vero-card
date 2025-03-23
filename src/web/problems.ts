import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator as vValidator } from 'hono-openapi/valibot';
import { createFakeLearningHistoryRepository, createFakeProblemRepository, createFakeProficiencyLevelRepository } from '../adapters/repository/fake-repositories';
import * as v from 'valibot';
import { dateStringSchema, ProblemSchema } from '../adapters/schema';
import { calculateLevel } from '../domain/level';

const problemRepo = createFakeProblemRepository(new Map());
const learningHistoryRepo = createFakeLearningHistoryRepository(new Map());
export const proficiencyLevelRepo = createFakeProficiencyLevelRepository(new Map());

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
    description: '새 문제를 생성합니다',
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

problemsRoutes.post(
  '/problems/:problemId/learning-histories',
  describeRoute({
    description: '어떤 문제 하나를 학습합니다',
    responses: {
      201: {
        description: 'Successfully created!',
      },
    },
  }),
  vValidator("param", v.object({
    problemId: v.string(),
  })),
  vValidator('json', v.object({
    id: v.string(),
    answer: v.string(),
    isRight: v.boolean(),
    createdAt: dateStringSchema
  }) ),
  async (c) => {
    const { problemId }= c.req.valid('param');
    const { id, answer, isRight, createdAt } = c.req.valid('json');

    const learnerId = "twinstae";

    const problem = await problemRepo.getProblemById(problemId);
    
    if (!problem) {
      return new Response(problemId + ' 문제를 찾을 수 없습니다', { status: 404 });
    }

    await learningHistoryRepo.createLearningHistory({
      id,
      createdAt: new Date(createdAt),
      cardId: problem.cardId,
      problemId,
      answer,
      isRight,
      learnerId
    })

    // level 을 업데이트하고 영속해주는 코드가 있다
    const learningHistories = await learningHistoryRepo.getLearningHistoryListByLearnerIdAndCardId({
      cardId: problem.cardId,
      learnerId
    });

    await proficiencyLevelRepo.saveProficiencyLevel({
      learnerId,
      cardId: problem.cardId,
      value: calculateLevel(learningHistories),
      updatedAt: new Date(createdAt)
    })

    return new Response('', { status: 201 });
  }
);

export default problemsRoutes;