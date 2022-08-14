import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Game from "./pages/Game";
import Create from "./pages/Create";
import Join from "./pages/Join";
import "./App.css";

export const endpoint = "http://localhost:5000";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play" element={<Game />} />
      <Route path="/create" element={<Create />} />
      <Route path="/join" element={<Join />} />
    </Routes>
  );
};

export default App;
