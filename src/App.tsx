import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { HomePage, PingPage, LobbyPage, LoginPage } from './pages';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/ping" element={<PingPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/lobby" element={<LobbyPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
