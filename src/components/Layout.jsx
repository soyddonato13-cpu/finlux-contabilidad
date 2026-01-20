import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CreditCard, Landmark, Target, PieChart, Settings, LogOut, PlusCircle, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useFinance } from '../context/FinancialContext';
import { useAuth } from '../context/AuthContext';
import TransactionModal from './TransactionModal';
import VoiceAssistant from './VoiceAssistant';
import { useSound } from '../hooks/useSound';

const SidebarItem = ({ icon: Icon, label, to, active }) => {
    const { playHover, playClick } = useSound(); // Added useSound hook
    return (
        <Link to={to} onClick={playClick} onMouseEnter={playHover}> {/* Added onClick and onMouseEnter handlers */}
            <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${active
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                <Icon size={20} />
                <span className="font-medium tracking-wide">{label}</span>
            </motion.div>
        </Link>
    );
};

const Layout = ({ children }) => {
    const location = useLocation();
    const { openModal } = useFinance();
    const { user, loginWithGoogle, logout } = useAuth();

    return (
        <div className="flex h-screen bg-background relative overflow-hidden">
            {/* UI Overlays */}
            <TransactionModal />
            <VoiceAssistant />

            {/* Ambient Background - Animated Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-float opacity-60 pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Sidebar - Glassmorphism */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-64 h-full p-6 z-10 hidden md:flex flex-col border-r border-white/5 bg-glass backdrop-blur-xl supports-[backdrop-filter]:bg-surface/50"
            >
                <div className="flex flex-col mb-10 px-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#b8860b] flex items-center justify-center shadow-lg shadow-primary/20">
                            <Wallet className="text-[#0A192F]" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
                            FinLux
                        </h1>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 pl-1">
                        By Isaron Studio
                    </p>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Resumen" to="/" active={location.pathname === '/'} />
                    <SidebarItem icon={Landmark} label="Cuentas" to="/accounts" active={location.pathname === '/accounts'} />
                    <SidebarItem icon={Target} label="Metas" to="/budgets" active={location.pathname === '/budgets'} />
                    <SidebarItem icon={CreditCard} label="Movimientos" to="/transactions" active={location.pathname === '/transactions'} />
                    <SidebarItem icon={PieChart} label="Estadísticas" to="/stats" active={location.pathname === '/stats'} />
                    <SidebarItem icon={Settings} label="Ajustes" to="/settings" active={location.pathname === '/settings'} />
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="px-2 mb-2">
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">
                            Engineered by <span className="text-primary italic">Isaron Studio</span>
                        </p>
                    </div>

                    <motion.button
                        onClick={openModal}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-[#b8860b] text-[#0A192F] font-black shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={20} />
                        <span>Nuevo Movimiento</span>
                    </motion.button>

                    {user ? (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                            <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-primary/50" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                                <button onClick={logout} className="text-xs text-slate-500 hover:text-danger flex items-center gap-1 transition-colors">
                                    <LogOut size={12} />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={loginWithGoogle}
                            className="w-full py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 transition-all"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">Acceder con Google</span>
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* Mobile Top Header */}
            <div className="fixed top-0 left-0 w-full h-16 bg-surface/80 backdrop-blur-xl border-b border-white/5 md:hidden z-50 flex justify-between items-center px-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#b8860b] flex items-center justify-center shadow-lg shadow-primary/20">
                            <Wallet className="text-[#0A192F]" size={18} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
                            FinLux
                        </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/40 mt-0.5 ml-0.5">
                        Isaron Studio Asset
                    </span>
                </div>

                {user ? (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={logout}
                        className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/5"
                    >
                        <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-primary/50" />
                    </motion.button>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={loginWithGoogle}
                        className="bg-primary text-[#0A192F] p-2 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                    >
                        Entrar
                    </motion.button>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 relative z-0 overflow-y-auto pt-16 pb-24 md:pt-0 md:pb-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-2xl border-t border-white/5 md:hidden z-50 flex justify-around items-center p-3 pb-safe shadow-2xl">
                <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-slate-500'}`}>
                    <LayoutDashboard size={18} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Inicio</span>
                </Link>

                <Link to="/accounts" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/accounts' ? 'text-primary' : 'text-slate-500'}`}>
                    <Landmark size={18} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Cuentas</span>
                </Link>

                <motion.button
                    onClick={openModal}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gradient-to-tr from-primary to-[#b8860b] rounded-2xl flex items-center justify-center text-[#0A192F] shadow-lg shadow-primary/30 border-2 border-white/10"
                >
                    <PlusCircle size={24} />
                </motion.button>

                <Link to="/budgets" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/budgets' ? 'text-primary' : 'text-slate-500'}`}>
                    <Target size={18} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Metas</span>
                </Link>

                <Link to="/stats" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/stats' ? 'text-primary' : 'text-slate-500'}`}>
                    <PieChart size={18} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Análisis</span>
                </Link>
            </div>        </div>
    );
};

export default Layout;
