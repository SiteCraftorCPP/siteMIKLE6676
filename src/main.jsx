import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PrivacyPolicy from './PrivacyPolicy.jsx'
import './index.css'

// Отключаем StrictMode для предотвращения двойного рендера и проблем с путями на мобилках
ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  </HashRouter>
)