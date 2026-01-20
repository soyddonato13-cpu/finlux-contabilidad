import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const BudgetCard = ({ category, spent, limit, transactions }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOver = spent > limit;
    const isWarning = percentage > 80 && !isOver;

    const categoryTransactions = transactions
        .filter(t => t.category === category && t.type === 'expense')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-surface/30 backdrop-blur-xl border border-white/5 p-6 rounded-3xl cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-primary/50 bg-surface/50' : 'hover:bg-white/5'}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-white font-bold text-lg">{category}</h4>
                    <p className="text-slate-400 text-sm">Gasto Mensual</p>
                </div>
                <div className={`p-3 rounded-2xl ${isOver ? 'bg-danger/20 text-danger' : isWarning ? 'bg-orange-500/20 text-orange-400' : 'bg-primary/20 text-primary'}`}>
                    <Target size={20} />
                </div>
            </div>

            <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold font-mono text-white">${spent.toLocaleString()}</span>
                <span className="text-slate-500 text-sm">límite: ${limit.toLocaleString()}</span>
            </div>

            <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${isOver ? 'bg-danger' : isWarning ? 'bg-orange-500' : 'bg-primary'}`}
                />
            </div>

            {isOver && (
                <div className="flex items-center gap-2 text-danger text-xs font-medium mb-2">
                    <AlertCircle size={14} />
                    <span>Exceso: ${(spent - limit).toLocaleString()}</span>
                </div>
            )}

            {/* Drill-down Detail */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-4 border-t border-white/5 mt-4"
                    >
                        <h5 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Historial de {category}</h5>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 noscroll">
                            {categoryTransactions.length > 0 ? (
                                categoryTransactions.map(t => (
                                    <div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div>
                                            <div className="text-sm font-medium text-white">{t.description}</div>
                                            <div className="text-[10px] text-slate-400 flex gap-2">
                                                <span className="capitalize">{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(new Date(t.date))}</span>
                                                <span>{new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(t.date))}</span>
                                            </div>
                                        </div>
                                        <div className="text-danger font-mono font-bold">-${t.amount.toFixed(2)}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4">No hay gastos registrados en esta categoría.</p>
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

    // Calculate real spent amounts per category
    const getSpent = (cat) => {
        return transactions
            .filter(t => t.category === cat && t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const budgetConfigs = [
        { id: 'b1', category: 'Comida', limit: 500 },
        { id: 'b2', category: 'Transporte', limit: 200 },
        { id: 'b3', category: 'Ocio', limit: 150 },
        { id: 'b4', category: 'Hogar', limit: 1000 },
        { id: 'b5', category: 'Salud', limit: 300 },
    ];

    return (
        <Layout>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white">Presupuestos Inteligentes</h2>
                    <p className="text-slate-400">Toca una categoría para ver el detalle de cada gasto.</p>
                </div>

                <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-medium">
                    <AlertCircle size={18} />
                    <span>Límites sugeridos basados en tu ahorro.</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
