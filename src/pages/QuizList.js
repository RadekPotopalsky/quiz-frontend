import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteQuiz, getAllQuizzes } from "../api";

export default function QuizList({ admin }) {
  const [quizzes, setQuizzes] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setBusy(true); setError("");
    try { setQuizzes(await getAllQuizzes()); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);
  const remove = async (quiz) => {
    if (!window.confirm(`Opravdu smazat „${quiz.title}“ včetně všech výsledků? Tuto akci nelze vrátit.`)) return;
    try { await deleteQuiz(quiz.id); await load(); }
    catch (e) { setError(e.message); }
  };
  return <main>
    <div className="page-heading"><div><span className="eyebrow">Přehled</span><h1>Kvízy</h1><p>Vyber si téma a procvič si učivo.</p></div>
      {admin && <Link className="button primary" to="/create">+ Vytvořit kvíz</Link>}</div>
    {error && <p className="error" role="alert">{error}</p>}
    {busy ? <p>Načítám kvízy…</p> : quizzes.length === 0 ? <div className="panel empty">Zatím tu nejsou žádné kvízy.</div> :
      <div className="quiz-grid">{quizzes.map(q => <article className="panel quiz-card" key={q.id}>
        <div className="card-top"><span className="tag">{q.question_count} otázek</span><span className="muted">{new Date(q.created_at).toLocaleDateString("cs-CZ")}</span></div>
        <h2>{q.title}</h2><p className="muted">{q.attempts ? `${q.attempts} pokusů · průměr ${q.avg_success}%` : "Zatím bez pokusu"}</p>
        <div className="card-actions"><Link className="button primary" to={`/quiz/${encodeURIComponent(q.id)}`}>Spustit kvíz</Link>
          <Link className="button secondary" to={`/stats/${encodeURIComponent(q.id)}`}>Výsledky</Link>
          {admin && <button className="button danger-quiet" onClick={() => remove(q)}>Smazat</button>}</div>
      </article>)}</div>}
  </main>;
}
