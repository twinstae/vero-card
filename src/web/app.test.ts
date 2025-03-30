import { describe, expect, test } from "bun:test";
import app from "./app.ts";
import { testCard } from "../domain/card.fixtures.ts";
import { YesOrNoProblem } from "../domain/problem.fixtures.ts";

const HOST = "http://localhost:8000";

const client = {
  async get(path: string) {
    const res = await app.fetch(new Request(HOST + path));

    if (res.status !== 200) {
      return Promise.reject(path + " : " + (await res.text()));
    }

    return res.json();
  },
  async post(path: string, body: any) {
    const res = await app.fetch(
      new Request(HOST + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    );

    if (res.status !== 201) {
      return Promise.reject(path + " : " + (await res.text()));
    }

    return res;
  },
};

describe("cards api", () => {
  test("카드를 생성하고 읽어올 수 있다", async () => {
    // given
    expect(await client.get("/cards")).toStrictEqual([]);

    // when
    expect((await client.post("/cards", testCard)).status).toBe(201);

    // then
    expect(await client.get("/cards")).toStrictEqual([testCard]);
  });
});

describe("problems api", () => {
  test("문제를 생성하고 읽어올 수 있다", async () => {
    // given
    expect(await client.get("/problems")).toStrictEqual([]);

    // when
    expect((await client.post("/problems", YesOrNoProblem)).status).toBe(201);

    // then
    expect(await client.get("/problems")).toStrictEqual([YesOrNoProblem]);
  });

  test("문제를 풀 수 있다", async () => {
    // given
    expect(await client.get("/problems")).toStrictEqual([YesOrNoProblem]);

    const createdAt = new Date().toISOString();

    // when
    expect(
      (
        await client.post("/problems/" + YesOrNoProblem.id + "/learning-histories", {
          id: "solve-1",
          answer: "O",
          isRight: true,
          createdAt,
        })
      ).status
    ).toBe(201);

    // 레벨이 올라가서 1이 되었다???

    const testLearnerId = "twinstae";
    expect(await client.get("/learners/" + testLearnerId + "/proficiency-levels")).toStrictEqual([
      {
        learnerId: testLearnerId,
        cardId: YesOrNoProblem.cardId,
        value: 1,
        updatedAt: createdAt,
      },
    ]);
  });
});
