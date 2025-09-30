import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://quiz-backend-uoqh.onrender.com";

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // načtení kvízu
  useEffect(() => {
    fetch(`${API_BASE}/get_quiz?id=${id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch(() => setError("Chyba při načítání kvízu"));
  }, [id]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!quiz) return <div>Načítám kvíz...</div>;

  const handleChange = (qIndex, optIndex) => {
    setAnswers({
      ...answers,
      [qIndex]: optIndex,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/submit_answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id: quiz.id,
          answers,
          user_name: userName || "Anonym",
        }),
      });

      if (!res.ok) throw new Error("Odeslání odpovědí selhalo");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{quiz.title}</h2>

      {!result && (
        <div style={{ marginBottom: 20 }}>
          <label>
            Zadej své jméno (nepovinné):{" "}
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ padding: 5 }}
            />
          </label>
        </div>
      )}

      {quiz.questions.map((q, qIndex) => {
        const selected = answers[qIndex];
        const correctAnswer = result
          ? result.details.find((d) => d.index === qIndex).correct
          : null;
        const userAnswer = result
          ? result.details.find((d) => d.index === qIndex).user_answer
          : null;

        return (
          <div
            key={qIndex}
            style={{
              marginBottom: 20,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <p>
              <strong>
                {qIndex + 1}. {q.question}
              </strong>
            </p>
            {q.options.map((opt, optIndex) => {
              let style = {};
              if (result) {
                if (opt === correctAnswer && opt === userAnswer) {
                  style = { backgroundColor: "#c8e6c9" }; // zeleně správně vybrané
                } else if (opt === userAnswer && opt !== correctAnswer) {
                  style = { backgroundColor: "#ffcdd2" }; // červeně špatně vybrané
                } else if (opt === correctAnswer && opt !== userAnswer) {
                  style = { backgroundColor: "#e0e0e0" }; // šedě správná, ale nevybraná
                }
              }

              return (
                <label
                  key={optIndex}
                  style={{
                    display: "block",
                    marginBottom: 6,
                    padding: 4,
                    borderRadius: 4,
                    ...style,
                  }}
                >
                  <input
                    type="radio"
                    name={`q-${qIndex}`}
                    value={optIndex}
                    checked={selected === optIndex}
                    onChange={() => handleChange(qIndex, optIndex)}
                    disabled={!!result}
                  />{" "}
                  {opt}
                </label>
              );
            })}
          </div>
        );
      })}

      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {loading ? "Odesílám..." : "Vyhodnotit"}
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          <h3>Výsledek:</h3>
          <p>
            Skóre: {result.score}/{result.total} ({result.percentage}%)
          </p>
        </div>
      )}
    </div>
  );
}