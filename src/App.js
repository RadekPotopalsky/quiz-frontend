import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { getMe, getToken, login, setToken } from "./api";
import QuizList from "./pages/QuizList";
import Quiz from "./pages/Quiz";
import Stats from "./pages/Stats";
import StatsByQuiz from "./pages/StatsByQuiz";
import ResultDetail from "./pages/ResultDetail";
import CreateQuiz from "./pages/CreateQuiz";
import Accounts from "./pages/Accounts";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const data = await login(username, password);
      setToken(data.token); onLogin(data.account);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  return <main className="login-page"><form className="panel login-card" onSubmit={submit}>
    <div className="brand-mark">?</div><h1>Kvízy z učebnice</h1>
    <p>Přihlas se a pokračuj v učení.</p>
    <label>Jméno<input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required /></label>
    <label>Heslo<input autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="primary" disabled={busy}>{busy ? "Přihlašuji…" : "Přihlásit se"}</button>
  </form></main>;
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [checking, setChecking] = useState(!!getToken());
  useEffect(() => {
    if (getToken()) getMe().then(setAccount).catch(() => setToken(null)).finally(() => setChecking(false));
  }, []);
  if (checking) return <div className="center-message">Načítám účet…</div>;
  if (!account) return <Login onLogin={setAccount} />;
  const admin = account.role === "admin";
  return <BrowserRouter>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" to="/"><span className="brand-mark small">?</span><span>Kvízy z učebnice</span></Link>
      <nav aria-label="Hlavní navigace"><Link to="/">Kvízy</Link><Link to="/stats">Výsledky</Link>
        {admin && <><Link to="/create">Nový kvíz</Link><Link to="/accounts">Účty</Link></>}
      </nav><div className="user-box"><span>{account.username}</span><button className="link-button" onClick={() => { setToken(null); setAccount(null); }}>Odhlásit</button></div>
    </div></header>
    <div className="page-shell"><Routes>
      <Route path="/" element={<QuizList admin={admin} />} />
      <Route path="/quiz/:id" element={<Quiz />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/stats/:quizId" element={<StatsByQuiz />} />
      <Route path="/result/:id" element={<ResultDetail />} />
      {admin && <><Route path="/create" element={<CreateQuiz />} /><Route path="/accounts" element={<Accounts />} /></>}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></div>
  </BrowserRouter>;
}
