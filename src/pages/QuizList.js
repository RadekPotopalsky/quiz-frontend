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
  if (err) return <p style={{ color: "crimson" }}>Chyba: {err}</p>;
  if (!quizzes.length) return <p>Zatím tu nejsou žádné kvízy.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Seznam kvízů</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Název</th>
            <th>Datum vytvoření</th>
            <th>Úspěšnost</th>
            <th>Počet spuštění</th>
            <th>Statistika</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q.id}>
              <td>
                <Link to={`/quiz/${encodeURIComponent(q.id)}`}>{q.title}</Link>
              </td>
              <td>{q.created_at}</td>
              <td>{q.avg_success}%</td>
              <td>{q.attempts}</td>
              <td>
                <Link to={`/stats/${q.id}`}>
                  <button style={{ padding: "4px 10px" }}>Statistika</button>
                </Link>
              </td>
              <td>
                <button style={{ padding: "4px 10px", backgroundColor: "#f44336", color: "#fff" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}