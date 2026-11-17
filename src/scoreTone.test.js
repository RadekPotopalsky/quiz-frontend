import scoreTone from "./scoreTone";

test("hranice barev výsledků odpovídají 60 a 85 procentům", () => {
  expect(scoreTone(100)).toBe("high");
  expect(scoreTone(85)).toBe("high");
  expect(scoreTone(84.9)).toBe("medium");
  expect(scoreTone(60)).toBe("medium");
  expect(scoreTone(59.9)).toBe("low");
  expect(scoreTone(null)).toBe("neutral");
});
