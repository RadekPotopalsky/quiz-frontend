import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResults } from "../api";
import scoreTone from "../scoreTone";

export function ResultsList({ results }) {
  if (!results.length) return <div className="panel empty">Zatím tu nejsou žádné výsledky.</div>;
  return <div className="result-list">{results.map(r => <Link to={`/result/${r.id}`} className="panel result-row" key={r.id}>
    <div><strong>{r.quiz_title || "Smazaný kvíz"}</strong><div className="muted">{r.user_name} · {new Date(r.created_at).toLocaleString("cs-CZ")}</div></div>
    <div className={`score score-tone-${scoreTone(r.percentage)}`}><strong>{r.percentage}%</strong><span>{r.score}/{r.total}</span></div></Link>)}</div>;
}

export default function Stats() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getResults().then(setResults).catch(e => setError(e.message)); }, []);
  return <main><div className="page-heading"><div><span className="eyebrow">Historie</span><h1>Výsledky</h1><p>Přehled dokončených kvízů.</p></div></div>
    {error && <p className="error" role="alert">{error}</p>}{results ? <ResultsList results={results} /> : !error && <p>Načítám výsledky…</p>}</main>;
}
