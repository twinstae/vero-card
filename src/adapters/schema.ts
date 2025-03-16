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
})