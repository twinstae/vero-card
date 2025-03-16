import * as v from 'valibot';

const dateStringSchema = v.pipe(
  v.string(),
  v.isoTimestamp('The date is badly formatted.')
);

export const CardSchema = v.object({
  id: v.string(),
  version: v.string(),
  createdAt: dateStringSchema,
  type: v.picklist(['concept', 'material']),
  title: v.string(),
  content: v.string(),
  links: v.array(v.string()),
  refCardId: v.array(v.string()),
});

export const ProblemSchema = v.intersect([
  v.object({
    id: v.string(),
    createdAt: dateStringSchema,
    updatedAt: dateStringSchema,
    cardId: v.string(),
  }),
  v.union([
    v.object({
      type: v.literal('yes-or-no'),
      content: v.object({
        question: v.string(),
        answer: v.boolean(),
      }),
    }),
    v.object({
      type: v.picklist(['short-answer', 'long-answer']),
      content: v.object({
        question: v.string(),
        answer: v.string(),
      }),
    }),
    v.object({
      type: v.literal('selection'),
      content: v.object({
        question: v.string(),
        options: v.array(
          v.object({
            text: v.string(),
            isAnswer: v.boolean(),
          })
        ),
      }),
    }),
  ]),
]);
