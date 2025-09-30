const API_BASE_URL = "https://quiz-backend-uoqh.onrender.com";

export async function getQuiz(id) {
  const response = await fetch(`${API_BASE_URL}/get_quiz?id=${id}`);
  if (!response.ok) {
    throw new Error("Chyba při načítání kvízu");
  }
  return await response.json();
}

export async function getAllQuizzes() {
  const response = await fetch(`${API_BASE_URL}/get_all_quizzes`);
  if (!response.ok) {
    throw new Error("Chyba při načítání seznamu kvízů");
  }
  return await response.json();
}

export async function submitAnswers(data) {
  const response = await fetch(`${API_BASE_URL}/submit_answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Chyba při odesílání odpovědí");
  }

  return await response.json();
}

// 🔹 Nová funkce na získání výsledků
export async function getResults(userName = null) {
  let url = `${API_BASE_URL}/get_results`;
  if (userName) {
    url += `?user_name=${encodeURIComponent(userName)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Chyba při načítání výsledků");
  }
  return await response.json();
}