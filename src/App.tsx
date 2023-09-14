import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { HomePage, PingPage, LobbyPage, LoginPage, AnadirPDT, PDT, PDTid } from './pages';

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
          <Route path='/pdt' element={<PDT/>} />
          <Route path='/pdt/:id' element={<PDTid/>} />
          <Route path="/anadirPDT" element={<AnadirPDT/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
