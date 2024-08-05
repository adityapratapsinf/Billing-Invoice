import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Billing from './Component/Billing';
import Login from './Authenti/Login';
import Signin from './Authenti/Signin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Billing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />

      </Routes>
    </Router>
  );
}

export default App;
