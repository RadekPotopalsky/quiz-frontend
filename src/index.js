import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import QuizList from "./pages/QuizList";
import Quiz from "./pages/Quiz";
import Stats from "./pages/Stats";
import ResultDetail from "./pages/ResultDetail";
import StatsByQuiz from "./pages/StatsByQuiz"; // ✅ doplněno
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <nav style={{ padding: "10px 20px", borderBottom: "1px solid #eee" }}>
      <Link to="/" style={{ marginRight: 16 }}>
        Kvízy
      </Link>
      <Link to="/stats">Statistiky</Link>
    </nav>
    <Routes>
      <Route path="/" element={<QuizList />} />
      <Route path="/quiz/:id" element={<Quiz />} />
      <Route path="/stats/:quizId" element={<StatsByQuiz />} /> {/* ✅ nová route */}
      <Route path="/stats" element={<Stats />} />
      <Route path="/result/:id" element={<ResultDetail />} />
      <Route path="*" element={<QuizList />} />
    </Routes>
  </BrowserRouter>
);