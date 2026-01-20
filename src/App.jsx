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

  useEffect(() => {
    console.log("App mounted. Auth Loading:", loading);
  }, [loading]);

  if (loading) return (
    <div className="h-screen w-screen bg-[#040b16] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#D4AF37]/10 border-t-[#D4AF37] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-full animate-pulse blur-sm" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-sm animate-pulse">Isaron Studio</p>
        <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">Iniciando Activo Digital</p>
      </div>
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
