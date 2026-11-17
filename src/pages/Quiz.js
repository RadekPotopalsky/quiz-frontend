import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuiz, submitAnswers } from "../api";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { getQuiz(id).then(setQuiz).catch(e => setError(e.message)); }, [id]);
  if (error && !quiz) return <p className="error" role="alert">{error}</p>;
  if (!quiz) return <p>Načítám kvíz…</p>;
  const question = quiz.questions[index];
  const answered = Object.keys(answers).length;
  const submit = async () => {
    if (answered !== quiz.questions.length) { setError("Nejdřív odpověz na všechny otázky."); return; }
    setBusy(true); setError("");
    try { const result = await submitAnswers(quiz.id, answers); navigate(`/result/${result.result_id}`); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  return <main className="narrow"><Link className="back-link" to="/">← Zpět ke kvízům</Link>
    <div className="page-heading"><div><span className="eyebrow">Procvičování</span><h1>{quiz.title}</h1>
      <p>Otázka {index + 1} z {quiz.questions.length} · Odpovězeno {answered}/{quiz.questions.length}</p></div></div>
    <div className="progress-track"><span style={{ width: `${answered / quiz.questions.length * 100}%` }} /></div>
    <section className="panel question-panel"><span className="tag">Otázka {index + 1}</span><h2>{question.question}</h2>
      <div className="options">{question.options.map((option, optionIndex) => <label className={`option ${answers[index] === optionIndex ? "selected" : ""}`} key={optionIndex}>
        <input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex}
          onChange={() => setAnswers({ ...answers, [index]: optionIndex })} />
        <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>
      </label>)}</div></section>
    <div className="step-actions"><button className="button secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Předchozí</button>
      {index < quiz.questions.length - 1 ? <button className="button primary" onClick={() => setIndex(index + 1)}>Další →</button>
        : <button className="button primary" disabled={busy} onClick={submit}>{busy ? "Vyhodnocuji…" : "Vyhodnotit kvíz"}</button>}</div>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="question-dots" aria-label="Přechod na otázku">{quiz.questions.map((_, i) => <button key={i}
      className={`${i === index ? "current" : ""} ${answers[i] !== undefined ? "done" : ""}`}
      aria-label={`Otázka ${i + 1}`} onClick={() => setIndex(i)}>{i + 1}</button>)}</div>
  </main>;
}
