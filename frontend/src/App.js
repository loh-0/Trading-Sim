import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import StockBuy from './stockbuy';
import Navbar from './Navbar'; // Make sure this import is correct
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/buy" element={<StockBuy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;