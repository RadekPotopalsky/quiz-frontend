import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getResultsByQuiz } from "../api";

export default function StatsByQuiz() {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResultsByQuiz(quizId)
      .then((data) => setResults(data))
      .catch(() => setError("Chyba při načítání výsledků"));
  }, [quizId]);

  const getColor = (percentage) => {
    if (percentage >= 85) return "#c8e6c9"; // zelená
    if (percentage >= 70) return "#fff9c4"; // žlutá
    return "#ffcdd2"; // červená
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!results.length) return <div>Načítám statistiky…</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Statistiky kvízu: {results[0]?.quiz_title}</h2>
      <table
        border="1"
        cellPadding="6"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Datum zpracování</th>
            <th>%</th>
            <th>Skóre</th>
            <th>Uživatel</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id}>
              <td>{formatDateTime(r.created_at)}</td>
              <td style={{ backgroundColor: getColor(r.percentage) }}>
                {r.percentage}%
              </td>
              <td>{r.score}/{r.total}</td>
              <td>{r.user_name}</td>
              <td>
                <Link to={`/result/${r.id}`}>Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 20 }}>
        <Link to="/stats">← Zpět na všechny statistiky</Link>
      </p>
    </div>
  );
}