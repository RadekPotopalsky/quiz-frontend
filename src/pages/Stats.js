import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://quiz-backend-uoqh.onrender.com";

export default function Stats() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/get_results`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error("Chyba při načítání výsledků:", err));
  }, []);

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Statistiky</h2>
      <table
        border="1"
        cellPadding="6"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Kvíz</th>
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
              <td>{r.quiz_title || r.quiz_id}</td>
              <td>{formatDateTime(r.created_at)}</td>
              <td style={{ backgroundColor: getColor(r.percentage) }}>
                {r.percentage}%
              </td>
              <td>
                {r.score}/{r.total}
              </td>
              <td>{r.user_name}</td>
              <td>
                <Link to={`/result/${r.id}`}>Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}