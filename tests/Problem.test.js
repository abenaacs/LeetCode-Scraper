import { Problem } from "../src/Problem.js";

describe("Problem Class", () => {
  let problem;

  beforeEach(() => {
    problem = new Problem();
  });

  test("should format problem name correctly", () => {
    const formattedName = problem.formatProblemName("Two Sum");
    expect(formattedName).toBe("TwoSum");
  });

  test("should update difficulty correctly", () => {
    document.body.innerHTML = `
      <div class="text-difficulty-medium"></div>
    `;
    problem.updateDifficulty();
    expect(problem.difficulty).toBe("medium");
  });
});

