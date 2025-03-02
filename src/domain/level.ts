export type SolutionRecord = {
  learnerId: string;
  problemId: string;
  cardId: string;
  result: 'correct' | 'wrong';
  solvedAt: Date;
};

export type ProficiencyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export function assertValidProficiencyLevel(n: number): ProficiencyLevel {
  if ([0, 1, 2, 3, 4, 5].includes(n)) {
    return n as ProficiencyLevel;
  }

  throw Error(n + '은 0,1,2,3,4,5 가 아닙니다!');
}

export function calculateLevel(
  solutionRecordList: SolutionRecord[]
): ProficiencyLevel {
  return [...solutionRecordList]
    .sort((a, b) => a.solvedAt.valueOf() - b.solvedAt.valueOf())
    .reduce((acc, solutionRecord) => {
      if (solutionRecord.result === 'correct') {
        if (acc >= 5) {
          return 5;
        }

        return assertValidProficiencyLevel(acc + 1);
      }

      if (solutionRecord.result === 'wrong') {
        if (acc <= 0) {
          return 0;
        }

        return assertValidProficiencyLevel(acc - 1);
      }

      return acc;
    }, 0 as ProficiencyLevel);
}
