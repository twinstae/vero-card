import type { LearningHistory } from "./learning-history";

export type ProficiencyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export function assertValidProficiencyLevel(n: number): ProficiencyLevel {
  if ([0, 1, 2, 3, 4, 5].includes(n)) {
    return n as ProficiencyLevel;
  }

  throw Error(n + '은 0,1,2,3,4,5 가 아닙니다!');
}

export function calculateLevel(
  learningHistoryList: LearningHistory[]
): ProficiencyLevel {
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
    }, 0 as ProficiencyLevel);
}
