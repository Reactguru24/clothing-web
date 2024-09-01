import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Admin from './Pages/Admin/Admin';
import Login from './Components/Login/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}

export default App;
