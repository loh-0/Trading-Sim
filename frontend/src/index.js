import React from 'react';
import ReactDOM from 'react-dom/client'; // 👈 updated import
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // 👈 new API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
