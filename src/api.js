const API_BASE = (process.env.REACT_APP_API_BASE || "https://quiz-backend-uoqh.onrender.com").replace(/\/$/, "");
const TOKEN_KEY = "quiz_session_v2";

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => token ? sessionStorage.setItem(TOKEN_KEY, token) : sessionStorage.removeItem(TOKEN_KEY);

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (_) {
    throw new Error("Server není dostupný. Na bezplatném Renderu může první načtení chvíli trvat.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Server vrátil chybu ${response.status}.`);
  return data;
}

const qs = (value) => encodeURIComponent(value);
export const login = (username, password) => api("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
export const getMe = () => api("/auth/me");
export const getAllQuizzes = () => api("/get_all_quizzes");
export const getQuiz = (id) => api(`/get_quiz?id=${qs(id)}`);
export const submitAnswers = (quiz_id, answers) => api("/submit_answers", { method: "POST", body: JSON.stringify({ quiz_id, answers }) });
export const getResults = () => api("/get_results");
export const getResultsByQuiz = (id) => api(`/get_results_by_quiz?quiz_id=${qs(id)}`);
export const getResult = (id) => api(`/get_result?id=${qs(id)}`);
export const deleteQuiz = (id) => api(`/delete_quiz?id=${qs(id)}`, { method: "DELETE" });
export const createQuiz = (quiz) => api("/create_quiz", { method: "POST", body: JSON.stringify(quiz) });
export const generateQuiz = (form) => api("/admin/generate-quiz", { method: "POST", body: form });
export const getAccounts = () => api("/admin/accounts");
export const createAccount = (username, password) => api("/admin/accounts", { method: "POST", body: JSON.stringify({ username, password }) });
export const changePassword = (id, password) => api(`/admin/accounts/${qs(id)}/password`, { method: "POST", body: JSON.stringify({ password }) });
