function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function obviousPattern(positions) {
  for (let i = 2; i < positions.length; i += 1) {
    if (positions[i] === positions[i - 1] && positions[i] === positions[i - 2]) return true;
  }
  for (let period = 2; period <= 4; period += 1) {
    for (let start = 0; start + 5 < positions.length; start += 1) {
      if ([0, 1, 2, 3, 4, 5].every(offset =>
        offset < period || positions[start + offset] === positions[start + offset - period])) return true;
    }
  }
  return false;
}

function correctPositions(count, random) {
  const choices = [0, 1, 2, 3];
  let positions = [];
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const extras = shuffle(choices, random).slice(0, count % 4);
    const pool = choices.flatMap(choice => Array(Math.floor(count / 4) + (extras.includes(choice) ? 1 : 0)).fill(choice));
    positions = shuffle(pool, random);
    if (!obviousPattern(positions)) break;
  }
  return positions;
}

export default function shuffleQuiz(quiz, random = Math.random) {
  const positions = correctPositions(quiz.questions.length, random);
  return {
    ...quiz,
    questions: quiz.questions.map((question, index) => {
      const correctAnswer = question.options[question.correct];
      const otherAnswers = shuffle(question.options.filter((_, i) => i !== question.correct), random);
      const options = [...otherAnswers];
      options.splice(positions[index], 0, correctAnswer);
      return { ...question, options, correct: positions[index] };
    })
  };
}
