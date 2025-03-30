import type { LearningHistory } from "./learning-history";

export type ProficiencyLevelValue = 0 | 1 | 2 | 3 | 4 | 5;

export type ProficiencyLevel = {
  learnerId: string;
  cardId: string;
  value: ProficiencyLevelValue;
  updatedAt: Date;
}

export function assertValidProficiencyLevel(n: number): ProficiencyLevelValue {
  if ([0, 1, 2, 3, 4, 5].includes(n)) {
    return n as ProficiencyLevelValue;
  }

  throw Error(n + '은 0,1,2,3,4,5 가 아닙니다!');
}

export function calculateLevel(
  learningHistoryList: LearningHistory[]
): ProficiencyLevelValue {
  return [...learningHistoryList]
    .sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf())
    .reduce((acc, learningHistory) => {
      if (learningHistory.isRight === true) {
        if (acc >= 5) {
          return 5;
        }

        return assertValidProficiencyLevel(acc + 1);
      }

      if (learningHistory.isRight === false) {
        if (acc <= 0) {
          return 0;
        }

        return assertValidProficiencyLevel(acc - 1);
      }

      return acc;
    }, 0 as ProficiencyLevelValue);
}
