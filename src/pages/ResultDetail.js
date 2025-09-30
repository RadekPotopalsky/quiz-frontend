import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResults } from "../api";

export default function ResultDetail() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResults()
      .then((data) => {
        const found = data.find((r) => String(r.id) === id);
        setResult(found);
      })
      .catch(() => setError("Chyba při načítání výsledku"));
  }, [id]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!result) return <div>Načítám detail výsledku...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Detail výsledku</h2>
      <p><strong>ID výsledku:</strong> {result.id}</p>
      <p><strong>Uživatel:</strong> {result.user_name}</p>
      <p><strong>Kvíz:</strong> {result.quiz_title}</p>
      <p><strong>Skóre:</strong> {result.score}/{result.total}</p>
      <p><strong>Úspěšnost:</strong> {result.percentage}%</p>
      <hr />

      <h3>Odpovědi:</h3>
      {result.answers.map((a, i) => {
        const isCorrect = a.is_correct;
        return (
          <div
            key={i}
            style={{
              marginBottom: 12,
              padding: 8,
              borderRadius: 6,
              backgroundColor: isCorrect ? "#c8e6c9" : "#ffcdd2" // zelená/červená
            }}
          >
            <p><strong>{i + 1}. {a.question}</strong></p>
            <p>
              <em>Vaše odpověď:</em> {a.user_answer || "—"}
            </p>
            {!isCorrect && (
              <p>
                <em>Správná odpověď:</em> {a.correct}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}