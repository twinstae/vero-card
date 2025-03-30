import type { Card } from "../../domain/card";
import type { LearningHistory } from "../../domain/learning-history";
import type { Problem } from "../../domain/problem";

// interface contract 계약
export interface ICardRepository {
  // query
  getAllCardList(): Promise<Card[]>;
  // mutation
  createCard(newCard: Card): Promise<void>;
}

export function createFakeCardRepository(initState: Map<string, Card>): ICardRepository {
  const stateMap = initState || new Map();
  return {
    async getAllCardList(): Promise<Card[]> {
      return [...stateMap.values()];
    },
    // mutation
    async createCard(newCard: Card): Promise<void> {
      stateMap.set(newCard.id, newCard);
    },
  };
}

export interface IProblemRepository {
  // query
  getAllProblemList(): Promise<Problem[]>;
  getProblemById(problemId: string): Promise<Problem | undefined>;
  // mutation
  createProblem(newProblem: Problem): Promise<void>;
  // update ?
}

export function createFakeProblemRepository(initState: Map<string, Problem>): IProblemRepository {
  const stateMap = initState || new Map();

  return {
    async getAllProblemList(): Promise<Problem[]> {
      return [...stateMap.values()];
    },
    async getProblemById(problemId) {
      return stateMap.get(problemId);
    },
    // mutation
    async createProblem(newProblem: Problem): Promise<void> {
      console.log("==========");
      console.log(stateMap);
      console.log("==========");
      stateMap.set(newProblem.id, newProblem);
    },
  };
}

export interface ILearningHistoryRepository {
  // query
  getLearningHistoryListByLearnerId(learnerId: string): Promise<LearningHistory[]>;
  getLearningHistoryListByCardIdAndLearnerId(cardId: string, learnerId: string): Promise<LearningHistory[]>;
  // mutation
  createLearningHistory(newLearningHistory: LearningHistory): Promise<void>;
}

export function createFakeLearningHistoryRepository(
  initState: Map<string, LearningHistory>
): ILearningHistoryRepository {
  const stateMap = initState || new Map();
  return {
    async getLearningHistoryListByLearnerId(learnerId: string): Promise<LearningHistory[]> {
      return [...stateMap.values()].filter((item) => item.learnerId === learnerId);
    },
    async getLearningHistoryListByCardIdAndLearnerId(cardId: string, learnerId: string): Promise<LearningHistory[]> {
      return [...stateMap.values()]
        .filter((item) => item.cardId === cardId)
        .filter((item) => item.learnerId === learnerId);
    },
    async createLearningHistory(newLearningHistory: LearningHistory): Promise<void> {
      stateMap.set(newLearningHistory.id, newLearningHistory);
    },
  };
}
