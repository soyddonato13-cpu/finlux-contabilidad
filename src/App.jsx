import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
import { FinancialProvider } from './context/FinancialContext';
import { AuthProvider } from './context/AuthContext';

const AppWithLoading = () => {
  const { loading } = useAuth();
  if (loading) return (
    <div className="h-screen w-screen bg-[#040b16] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] animate-pulse">Isaron Studio</p>
    </div>
  );

  return (
    <FinancialProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </FinancialProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWithLoading />
      </AuthProvider>
    </Router>
  );
}

export default App;
