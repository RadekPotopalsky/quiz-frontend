import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "https://quiz-backend-uoqh.onrender.com";

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Statistiky</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID výsledku</th>
            <th>Uživatel</th>
            <th>Kvíz</th>
            <th>Skóre</th>
            <th>%</th>
            <th>Datum</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user_name}</td>
              <td>{r.quiz_title || r.quiz_id}</td>
              <td>{r.score}/{r.total}</td>
              <td style={{ backgroundColor: getColor(r.percentage) }}>
                {r.percentage}%
              </td>
              <td>{new Date(r.created_at).toUTCString()}</td>
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