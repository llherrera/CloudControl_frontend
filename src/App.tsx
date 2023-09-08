import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/Home';
import PingPage from './pages/Ping';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/ping" element={<PingPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
