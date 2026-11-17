import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getResultsByQuiz } from "../api";
import { ResultsList } from "./Stats";

export default function StatsByQuiz() {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getResultsByQuiz(quizId).then(setResults).catch(e => setError(e.message)); }, [quizId]);
  return <main><Link className="back-link" to="/">← Zpět ke kvízům</Link><div className="page-heading"><div>
    <span className="eyebrow">Historie kvízu</span><h1>{results?.[0]?.quiz_title || "Výsledky kvízu"}</h1></div></div>
    {error && <p className="error" role="alert">{error}</p>}{results ? <ResultsList results={results} /> : !error && <p>Načítám výsledky…</p>}</main>;
}
