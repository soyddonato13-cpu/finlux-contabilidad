import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';
import { AnimatePresence } from 'framer-motion';

const CATEGORY_COLORS = {
    'Comida': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
    'Transporte': { bg: 'bg-blue-500/10', text: 'text-blue-400', bar: 'bg-blue-500', glow: 'shadow-blue-500/20' },
    'Hogar': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', bar: 'bg-indigo-500', glow: 'shadow-indigo-500/20' },
    'Ocio': { bg: 'bg-pink-500/10', text: 'text-pink-400', bar: 'bg-pink-500', glow: 'shadow-pink-500/20' },
    'Salud': { bg: 'bg-rose-500/10', text: 'text-rose-400', bar: 'bg-rose-500', glow: 'shadow-rose-500/20' },
    'Servicios': { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500', glow: 'shadow-amber-500/20' },
    'Educación': { bg: 'bg-violet-500/10', text: 'text-violet-400', bar: 'bg-violet-500', glow: 'shadow-violet-500/20' },
    'Compras': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', bar: 'bg-cyan-500', glow: 'shadow-cyan-500/20' },
    'Inversiones': { bg: 'bg-lime-500/10', text: 'text-lime-400', bar: 'bg-lime-500', glow: 'shadow-lime-500/20' },
    'Mantenimiento': { bg: 'bg-orange-500/10', text: 'text-orange-400', bar: 'bg-orange-500', glow: 'shadow-orange-500/20' },
    'General': { bg: 'bg-slate-500/10', text: 'text-slate-400', bar: 'bg-slate-500', glow: 'shadow-slate-500/20' }
};

const BudgetCard = ({ category, spent, limit, transactions }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOver = spent > limit;
    const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['General'];

    const categoryTransactions = transactions
        .filter(t => t.category === category && t.type === 'expense')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-surface/40 backdrop-blur-3xl border border-white/5 p-6 rounded-[32px] cursor-pointer transition-all ${isExpanded ? 'ring-1 ring-white/10 bg-surface/60' : 'hover:bg-white/5 active:scale-[0.98]'}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${colors.bg} ${colors.text} shadow-xl ${colors.glow}`}>
                        <Target size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg leading-tight">{category}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Presupuesto</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isOver && (
                        <span className="bg-danger/20 text-danger text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter animate-pulse">
                            Excedido
                        </span>
                    )}
                    <ChevronRight size={16} className={`text-slate-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
            </div>

            <div className="flex justify-between items-end mb-3">
                <span className="text-3xl font-black font-mono text-white tracking-tighter">${spent.toLocaleString()}</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pb-1">Límite: ${limit.toLocaleString()}</span>
            </div>

            <div className="h-4 bg-white/5 rounded-full overflow-hidden mb-2 relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className={`h-full rounded-full ${isOver ? 'bg-danger shadow-[0_0_15px_rgba(239,68,68,0.4)]' : colors.bar}`}
                />
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-6 border-t border-white/5 mt-6"
                    >
                        <h5 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-4 flex items-center gap-2">
                            <TrendingUp size={12} />
                            Análisis de Movimientos
                        </h5>
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 noscroll">
                            {categoryTransactions.length > 0 ? (
                                categoryTransactions.map(t => (
                                    <div key={t.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 group active:bg-white/10 transition-colors">
                                        <div>
                                            <div className="text-sm font-bold text-white mb-0.5">{t.description}</div>
                                            <div className="text-[10px] text-slate-500 font-bold flex gap-2 uppercase tracking-tight">
                                                <span className="text-slate-400">{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(new Date(t.date))}</span>
                                                <span>{new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(t.date))}</span>
                                            </div>
                                        </div>
                                        <div className="text-danger font-mono font-black text-sm">-${t.amount.toFixed(2)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 opacity-40">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Sin movimientos registrados</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Budgets = () => {
    const { transactions } = useFinance();

    const getSpent = (cat) => {
        return transactions
            .filter(t => t.category === cat && t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const budgetConfigs = [
        { id: 'b1', category: 'Comida', limit: 800 },
        { id: 'b2', category: 'Transporte', limit: 300 },
        { id: 'b3', category: 'Hogar', limit: 1200 },
        { id: 'b4', category: 'Ocio', limit: 250 },
        { id: 'b5', category: 'Salud', limit: 400 },
        { id: 'b6', category: 'Servicios', limit: 600 },
        { id: 'b7', category: 'Educación', limit: 500 },
        { id: 'b8', category: 'Compras', limit: 700 },
        { id: 'b9', category: 'Inversiones', limit: 1000 },
        { id: 'b10', category: 'Mantenimiento', limit: 350 },
    ];

    return (
        <Layout>
            <header className="mb-10 px-2">
                <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Control Maestro</h2>
                <p className="text-slate-500 font-bold tracking-tight text-lg">Supervisión en tiempo real de tus límites operativos.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                {budgetConfigs.map(b => (
                    <BudgetCard
                        key={b.id}
                        category={b.category}
                        limit={b.limit}
                        spent={getSpent(b.category)}
                        transactions={transactions}
                    />
                ))}
            </div>
        </Layout>
    );
};

export default Budgets;
