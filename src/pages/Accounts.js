import React, { useEffect, useState } from "react";
import { changePassword, createAccount, getAccounts } from "../api";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetId, setResetId] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const refresh = () => getAccounts().then(setAccounts).catch(e => setError(e.message));
  useEffect(() => { refresh(); }, []);
  const add = async (event) => {
    event.preventDefault(); setError(""); setMessage("");
    try { await createAccount(username, password); setUsername(""); setPassword(""); setMessage("Účet byl vytvořen."); await refresh(); }
    catch (e) { setError(e.message); }
  };
  const reset = async (event) => {
    event.preventDefault(); setError(""); setMessage("");
    try { await changePassword(resetId, resetPassword); setResetId(null); setResetPassword(""); setMessage("Heslo bylo změněno."); }
    catch (e) { setError(e.message); }
  };
  return <main className="narrow"><div className="page-heading"><div><span className="eyebrow">Správa</span><h1>Rodinné účty</h1>
    <p>Každý má vlastní přihlášení a své výsledky. Nové účty vytváří jen administrátor.</p></div></div>
    <form className="panel form-panel" onSubmit={add}><h2>Přidat žáka</h2>
      <label>Jméno<input value={username} onChange={e => setUsername(e.target.value)} minLength={2} required /></label>
      <label>Heslo (alespoň 12 znaků)<input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} minLength={12} required /></label>
      <button className="primary">Vytvořit účet</button></form>
    {error && <p className="error" role="alert">{error}</p>}{message && <p className="notice" role="status">{message}</p>}
    <h2 className="section-heading">Účty</h2><div className="result-list">{accounts.map(account => <div className="panel account-row" key={account.id}>
      <div><strong>{account.username}</strong><div className="muted">{account.role === "admin" ? "Administrátor" : "Žák"}</div></div>
      <button className="button secondary" onClick={() => { setResetId(account.id); setResetPassword(""); }}>Změnit heslo</button>
    </div>)}</div>
    {resetId && <form className="panel form-panel" onSubmit={reset}><h2>Nové heslo</h2><p>Pro účet {accounts.find(x => x.id === resetId)?.username}</p>
      <label>Nové heslo (alespoň 12 znaků)<input type="password" autoComplete="new-password" minLength={12} value={resetPassword} onChange={e => setResetPassword(e.target.value)} required /></label>
      <div className="step-actions"><button type="button" className="button secondary" onClick={() => setResetId(null)}>Zrušit</button><button className="button primary">Uložit heslo</button></div>
    </form>}
  </main>;
}
