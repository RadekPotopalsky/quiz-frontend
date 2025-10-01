import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuizList from "./pages/QuizList";
import Quiz from "./pages/Quiz";
import Stats from "./pages/Stats";
import ResultDetail from "./pages/ResultDetail";
import StatsByQuiz from "./pages/StatsByQuiz"; // nová stránka

function App() {
  return (
    <Router>
      <nav style={{ padding: 10 }}>
        <Link to="/" style={{ marginRight: 10 }}>Kvízy</Link>
        <Link to="/stats">Statistiky</Link>
      </nav>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/stats/:quizId" element={<StatsByQuiz />} /> {/* musí být před /stats */}
        <Route path="/stats" element={<Stats />} />
        <Route path="/result/:id" element={<ResultDetail />} />
      </Routes>
    </Router>
  );
}

export default App;