import { json, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

const typeEnum = pgEnum("card_type", ["concept", "material"]);

export const card = pgTable("card", {
  id: varchar("id", { length: 21 }).primaryKey(),
  version: varchar("version", { length: 16 }),
  createdAt: timestamp("created_at"),
  type: typeEnum("card_type"),
  title: varchar("title", { length: 64 }),
  content: text("content"),
  // links: string[],
  // refCardId: string[],
});

export const cardsRelations = relations(card, ({ many }) => ({
  problems: many(problem),
  refCards: many(card),
  backRefCards: many(card),
}));

export const problem = pgTable("problem", {
  id: varchar("id", { length: 21 }).primaryKey(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  cardId: varchar("id", { length: 21 }), // 이 카드 id는 변하는 것인가?
  type: varchar({ enum: ["yes-or-no", "short-answer", "long-answer", "selection"] }),
  content: json("content"),
});

export const problemsRelations = relations(problem, ({ one }) => ({
  card: one(card, {
    fields: [problem.cardId],
    references: [card.id],
  }),
}));

export type LearningHistory = {
  id: string;
  createdAt: Date;
  cardId: string;
  problemId: string;
  answer: string;
  isRight: boolean;
  learnerId: string;
};

export type SolutionRecord = {
  learnerId: string;
  problemId: string;
  cardId: string;
  result: "correct" | "wrong";
  solvedAt: Date;
};
