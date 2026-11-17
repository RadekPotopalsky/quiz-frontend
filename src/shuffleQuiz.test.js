import shuffleQuiz from "./shuffleQuiz";

function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function makeQuiz(count) {
  return {
    title: "Zkušební kvíz",
    questions: Array.from({ length: count }, (_, index) => ({
      question: `Otázka ${index + 1}`,
      options: Array.from({ length: 4 }, (_, choice) => `Otázka ${index + 1}, možnost ${choice + 1}`),
      correct: index % 4,
      source_quote: `Citace ${index + 1}`,
      source_image: "1"
    }))
  };
}

test("míchání zachová správné odpovědi a citace i u již rozpracovaného návrhu", () => {
  const original = makeQuiz(15);
  const originalSnapshot = JSON.stringify(original);
  const shuffled = shuffleQuiz(original, seededRandom(42));

  expect(JSON.stringify(original)).toBe(originalSnapshot);
  shuffled.questions.forEach((question, index) => {
    const before = original.questions[index];
    expect(question.options[question.correct]).toBe(before.options[before.correct]);
    expect([...question.options].sort()).toEqual([...before.options].sort());
    expect(question.source_quote).toBe(before.source_quote);
    expect(question.source_image).toBe(before.source_image);
  });
});

test("patnáct správných možností je vyvážených a nemá opakující se sled A B C D A B", () => {
  for (let seed = 1; seed <= 25; seed += 1) {
    const positions = shuffleQuiz(makeQuiz(15), seededRandom(seed)).questions.map(q => q.correct);
    const counts = [0, 1, 2, 3].map(choice => positions.filter(position => position === choice).length);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
    for (let start = 0; start + 5 < positions.length; start += 1) {
      expect(positions.slice(start, start + 2)).not.toEqual(positions.slice(start + 4, start + 6));
    }
  }
});
