import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createQuiz, generateQuiz, getPreferences, savePreferences } from "../api";
import AutoGrowTextarea from "../AutoGrowTextarea";
import CameraCapture from "../CameraCapture";
import shuffleQuiz from "../shuffleQuiz";

const DRAFT_KEY = "quiz_draft_v2";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [audience, setAudience] = useState("6. třída ZŠ");
  const audienceEdited = useRef(false);
  const [preferenceMessage, setPreferenceMessage] = useState("");
  const [savingPreference, setSavingPreference] = useState(false);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("15");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [draft, setDraft] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null"); } catch (_) { return null; }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    getPreferences().then(data => {
      if (!audienceEdited.current) setAudience(data.default_audience);
    }).catch(e => setError(e.message));
  }, []);
  useEffect(() => { if (draft) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); else sessionStorage.removeItem(DRAFT_KEY); }, [draft]);
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [files]);
  const addFiles = (incoming) => {
    const next = [...files, ...Array.from(incoming || [])];
    if (next.length > 10) { setError("Lze přiložit nejvýše 10 fotografií."); return false; }
    if (next.some(file => file.size > 12 * 1024 * 1024) || next.reduce((sum, file) => sum + file.size, 0) > 80 * 1024 * 1024) {
      setError("Jedna fotka smí mít nejvýše 12 MB, všechny dohromady 80 MB."); return false;
    }
    setError(""); setFiles(next);
    return true;
  };
  const saveAudience = async () => {
    setError(""); setPreferenceMessage(""); setSavingPreference(true);
    try {
      const saved = await savePreferences(audience);
      setAudience(saved.default_audience);
      setPreferenceMessage("Výchozí cílová skupina byla uložena pro další kvízy.");
    } catch (e) { setError(e.message); }
    finally { setSavingPreference(false); }
  };
  const generate = async (event) => {
    event.preventDefault(); setError("");
    if (!files.length) { setError("Nejdřív přilož fotky učebnice."); return; }
    if (draft && !window.confirm("Nahradit rozpracovaný návrh novým kvízem?")) return;
    const form = new FormData();
    files.forEach(file => form.append("images", file));
    form.append("audience", audience); form.append("topic", topic); form.append("question_count", count);
    setBusy(true);
    try { setDraft(shuffleQuiz(await generateQuiz(form))); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  const editQuestion = (index, field, value) => setDraft(current => ({ ...current,
    questions: current.questions.map((q, i) => i === index ? { ...q, [field]: value } : q) }));
  const editOption = (index, optionIndex, value) => setDraft(current => ({ ...current,
    questions: current.questions.map((q, i) => i === index ? { ...q, options: q.options.map((x, j) => j === optionIndex ? value : x) } : q) }));
  const publish = async () => {
    setBusy(true); setError("");
    try { const saved = await createQuiz(draft); setDraft(null); navigate(`/quiz/${saved.id}`); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };
  return <main className="narrow"><Link className="back-link" to="/">← Zpět ke kvízům</Link>
    <div className="page-heading"><div><span className="eyebrow">Správa kvízů</span><h1>Nový kvíz</h1>
      <p>Vyfoť stránky nebo vyber fotky z galerie. AI připraví návrh, který před zveřejněním zkontroluješ.</p></div></div>
    <form className="panel form-panel" onSubmit={generate}>
      <h2>1. Podklady</h2><div className="upload-actions"><button type="button" className="button secondary" onClick={() => {
        if (files.length >= 10) setError("Lze přiložit nejvýše 10 fotografií.");
        else setCameraOpen(true);
      }}>📷 Fotit více stránek</button><label className="button secondary upload-button">Systémový fotoaparát
        <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e => { addFiles(e.target.files); e.target.value = ""; }} /></label>
        <label className="button secondary upload-button">＋ Vybrat z galerie
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => { addFiles(e.target.files); e.target.value = ""; }} /></label></div>
      {files.length > 0 && <div className="file-list"><strong>Fotografie ({files.length}/10)</strong>{files.map((file, index) => <div key={`${file.name}-${index}`}>
        {previews[index] && <a href={previews[index]} target="_blank" rel="noreferrer" title="Otevřít fotografii"><img className="file-thumb" src={previews[index]} alt={`Fotografie ${index + 1}`} /></a>}
        <span>{index + 1}. {file.name}</span><button type="button" className="link-button" onClick={() => setFiles(files.filter((_, i) => i !== index))}>Odebrat</button></div>)}</div>}
      <div className="form-grid"><label>Pro koho je kvíz určen<input value={audience} maxLength={100} onChange={e => { audienceEdited.current = true; setAudience(e.target.value); setPreferenceMessage(""); }} required /></label>
        <label>Počet otázek<input type="number" min="1" max="30" value={count} onChange={e => setCount(e.target.value)} required /></label></div>
      <div className="preference-actions"><button type="button" className="button secondary" onClick={saveAudience} disabled={savingPreference || !audience.trim()}>{savingPreference ? "Ukládám…" : "Uložit jako výchozí"}</button>
        {preferenceMessage && <span className="preference-saved" role="status">{preferenceMessage}</span>}</div>
      <label>Téma (nepovinné)<input value={topic} maxLength={150} onChange={e => setTopic(e.target.value)} placeholder="Např. národní obrození" /></label>
      <p className="hint">Aplikace fotografie neukládá do databáze. Odešle je AI ke zpracování; u kvízu zůstane text citací a číslo fotografie.</p>
      <button className="primary" disabled={busy}>{busy ? "AI čte fotky a připravuje otázky…" : "Vytvořit návrh kvízu"}</button>
    </form>
    {error && <p className="error" role="alert">{error}</p>}
    {draft && <section className="draft-section"><div className="page-heading"><div><span className="eyebrow">Ke kontrole</span><h2>2. Zkontroluj otázky a citace</h2>
      <p>Návrh je uložený v této kartě prohlížeče. Před zveřejněním ověř správné odpovědi a doslovnost citací podle fotek.</p></div></div>
      <button type="button" className="button secondary" disabled={busy} onClick={() => setDraft(current => shuffleQuiz(current))}>Promíchat odpovědi</button>
      <p className="hint">Pořadí možností se změní, správná odpověď a citace zůstanou zachovány.</p>
      <label className="panel draft-title">Název kvízu<input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>
      {draft.questions.map((q, index) => <article className="panel draft-question" key={index}>
        <span className="tag">Otázka {index + 1}</span><label>Otázka<AutoGrowTextarea value={q.question} onChange={e => editQuestion(index, "question", e.target.value)} /></label>
        <div className="draft-options">{q.options.map((option, optionIndex) => <div key={optionIndex}>
          <input type="radio" name={`correct-${index}`} checked={q.correct === optionIndex} onChange={() => editQuestion(index, "correct", optionIndex)} aria-label={`Správná odpověď ${optionIndex + 1}`} />
          <AutoGrowTextarea value={option} onChange={e => editOption(index, optionIndex, e.target.value)} aria-label={`Možnost ${optionIndex + 1}`} />
        </div>)}</div><p className="hint">Vyber kolečko u správné odpovědi.</p>
        <label>Doslovná citace z učebnice<AutoGrowTextarea value={q.source_quote || ""} onChange={e => editQuestion(index, "source_quote", e.target.value)} /></label>
        <label>Číslo fotografie<input value={q.source_image || ""} onChange={e => editQuestion(index, "source_image", e.target.value)} /></label>
      </article>)}
      <div className="step-actions"><button className="button secondary" onClick={() => { if (window.confirm("Zahodit návrh kvízu?")) setDraft(null); }}>Zahodit návrh</button>
        <button className="button primary" disabled={busy} onClick={publish}>{busy ? "Ukládám…" : "Zveřejnit kvíz"}</button></div>
    </section>}
    {cameraOpen && <CameraCapture remaining={10 - files.length} onAccept={file => addFiles([file])} onClose={() => setCameraOpen(false)} />}
  </main>;
}
