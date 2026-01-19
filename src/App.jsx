import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import { FinancialProvider } from './context/FinancialContext';

function App() {
  return (
    <Router>
      <FinancialProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </FinancialProvider>
    </Router>
  );
}

export default App;
