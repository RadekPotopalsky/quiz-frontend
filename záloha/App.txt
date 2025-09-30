import React, { useEffect, useState } from 'react';

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);

  // Načti seznam kvízů
  useEffect(() => {
    fetch('https://quiz-backend-uoqh.onrender.com/get_all_quizzes')
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch(() => setError('Chyba při načítání seznamu kvízů'));
  }, []);

  // Načti konkrétní kvíz po výběru
  useEffect(() => {
    if (!selectedQuizId) return;
    fetch(`https://quiz-backend-uoqh.onrender.com/get_quiz?id=${selectedQuizId}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch(() => setError('Chyba při načítání kvízu'));
  }, [selectedQuizId]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Výběr kvízu
  if (!selectedQuizId) {
    return (
      <div>
        <h1>Vyber si kvíz</h1>
        {quizzes.length === 0 ? (
          <p>Načítání seznamu...</p>
        ) : (
          <ul>
            {quizzes.map((q) => (
              <li key={q.id}>
                <button onClick={() => setSelectedQuizId(q.id)}>
                  {q.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Zobrazení kvízu
  if (!quiz) return <div>Načítání kvízu...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((q, idx) => (
        <div key={idx}>
          <p><strong>{q.question}</strong></p>
          <ul>
            {q.options.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;