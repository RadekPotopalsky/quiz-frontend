import React, { useEffect, useState } from "react";
import { getResults } from "../api";

export default function Stats() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResults()
      .then((data) => setResults(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Načítám výsledky...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const getColor = (percentage) => {
    if (percentage >= 85) return "#c8e6c9"; // zelená
    if (percentage >= 70) return "#fff9c4"; // žlutá
    return "#ffcdd2"; // červená
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Statistiky</h2>
      {results.length === 0 ? (
        <p>Zatím nejsou žádné výsledky.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>ID výsledku</th>
              <th>Uživatel</th>
              <th>Kvíz</th>
              <th>Skóre</th>
              <th>%</th>
              <th>Datum</th>
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
                <td>{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}