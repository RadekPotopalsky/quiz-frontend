import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllQuizzes } from "../api";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await getAllQuizzes();
        setQuizzes(list);
      } catch (e) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Načítám kvízy…</p>;
  if (err) return <p style={{color:"crimson"}}>Chyba: {err}</p>;
  if (!quizzes.length) return <p>Zatím tu nejsou žádné kvízy.</p>;

  return (
    <div className="container">
      <h1>Výběr kvízu</h1>
      <ul className="quiz-list">
        {quizzes.map((q) => (
          <li key={q.id}>
            <Link to={`/quiz/${encodeURIComponent(q.id)}`}>{q.title || q.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}