import { describe, expect, test } from 'bun:test';
import {
  assertValidProficiencyLevel,
  calculateLevel,
  type SolutionRecord,
} from './level';

const testLearnerId = 'a'; // "김태희"
const testCardId = '1'; // 조건과 친하지 않은 행위
const testProblemId = 'x1ad'; // "다음 중 조건과 친하지 않은 행위인 것은?"
const testProblemId2 = 'y2hd'; // "다음 중 조건과 친한 행위인 것은?"

const 맞은_풀이기록: SolutionRecord = {
  learnerId: testLearnerId,
  problemId: testProblemId,
  cardId: testCardId,
  result: 'correct',
  solvedAt: new Date('2024-01-01T00:00:00Z'),
};

const 틀린_풀이기록 = {
  learnerId: testLearnerId,
  problemId: testProblemId2,
  cardId: testCardId,
  result: 'wrong',
  solvedAt: new Date('2024-01-01T00:00:00Z'),
} satisfies SolutionRecord;

const 예전_틀린_풀이기록 = {
  learnerId: testLearnerId,
  problemId: testProblemId2,
  cardId: testCardId,
  result: 'wrong',
  solvedAt: new Date('2023-12-31T00:00:00Z'),
} satisfies SolutionRecord;

describe('level', () => {
  test('숙련도는 0 1 2 3 4 5 만 가능하다', () => {
    expect(() => assertValidProficiencyLevel(-1)).toThrow();
    expect(assertValidProficiencyLevel(0)).toBe(0);
    expect(assertValidProficiencyLevel(1)).toBe(1);
    expect(assertValidProficiencyLevel(2)).toBe(2);
    expect(assertValidProficiencyLevel(3)).toBe(3);
    expect(assertValidProficiencyLevel(4)).toBe(4);
    expect(assertValidProficiencyLevel(5)).toBe(5);
    expect(() => assertValidProficiencyLevel(6)).toThrow();
  });

  test('처음에 숙련도는 0이다', () => {
    expect(calculateLevel([])).toBe(0);
  });

  test('문제를 풀어서 맞추면 숙련도는 1이 된다', () => {
    expect(calculateLevel([맞은_풀이기록])).toBe(1);
  });

  test('숙련도는 최대 5까지 올라간다', () => {
    expect(
      calculateLevel([
        맞은_풀이기록,
        맞은_풀이기록,
        맞은_풀이기록,
        맞은_풀이기록,
        맞은_풀이기록,
      ])
    ).toBe(5);
    expect(
      calculateLevel([
        맞은_풀이기록,
        맞은_풀이기록,
        맞은_풀이기록,
        맞은_풀이기록,
        맞은_풀이기록,
        맞은_풀이기록,
      ])
    ).toBe(5);
  });

  test('문제를 풀어서 틀리면  0으로 그대로 남는다', () => {
    expect(calculateLevel([틀린_풀이기록])).toBe(0);
  });

  test('맞고 틀리면 다시 0이 된다', () => {
    expect(calculateLevel([맞은_풀이기록, 틀린_풀이기록])).toBe(0);
  });

  test('틀리고 맞히면 1이 된다', () => {
    expect(calculateLevel([틀린_풀이기록, 맞은_풀이기록])).toBe(1);
  });

  test('시간 순으로 정렬해서 계산한다', () => {
    // 틀리고 맞았으니 1이 되야함
    expect(calculateLevel([맞은_풀이기록, 예전_틀린_풀이기록])).toBe(1);
  });
});
