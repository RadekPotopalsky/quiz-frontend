import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getResult } from "../api";
import scoreTone from "../scoreTone";

export default function ResultDetail() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getResult(id).then(setResult).catch(e => setError(e.message)); }, [id]);
  if (error) return <p className="error" role="alert">{error}</p>;
  if (!result) return <p>Načítám výsledek…</p>;
  return <main className="narrow"><Link className="back-link" to="/stats">← Zpět na výsledky</Link>
    <div className="panel result-hero"><span className="eyebrow">Hotovo · {result.user_name}</span><h1>{result.quiz_title}</h1>
      <div className={`big-score score-tone-${scoreTone(result.percentage)}`}>{result.percentage}%</div><p>Správně {result.score} z {result.total} otázek</p></div>
    <h2 className="section-heading">Odpovědi a vysvětlení</h2>
    {result.answers.map((answer, index) => <article className="panel answer-card" key={index}>
      <div className="answer-heading"><span className={`tag ${answer.is_correct ? "success" : "failure"}`}>{answer.is_correct ? "Správně" : "K opravě"}</span>
        <span className="muted">Otázka {index + 1}</span></div><h3>{answer.question}</h3>
      <p>Tvoje odpověď: <strong>{answer.user_answer || "Bez odpovědi"}</strong></p>
      {!answer.is_correct && <p>Správná odpověď: <strong>{answer.correct}</strong></p>}
      {answer.source_quote && <blockquote><span>V učebnici:</span> „{answer.source_quote}“{answer.source_image && <small> · fotografie {answer.source_image}</small>}</blockquote>}
    </article>)}
    <Link className="button primary" to={`/quiz/${encodeURIComponent(result.quiz_id)}`}>Zkusit znovu</Link>
  </main>;
}
