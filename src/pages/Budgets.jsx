import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const BudgetCard = ({ category, spent, limit, icon: Icon }) => {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOver = spent > limit;
    const isWarning = percentage > 80 && !isOver;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface/30 backdrop-blur-xl border border-white/5 p-6 rounded-3xl"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-white font-bold text-lg">{category}</h4>
                    <p className="text-slate-400 text-sm">Presupuesto mensual</p>
                </div>
                <div className={`p-3 rounded-2xl ${isOver ? 'bg-danger/20 text-danger' : isWarning ? 'bg-orange-500/20 text-orange-400' : 'bg-primary/20 text-primary'}`}>
                    <Target size={20} />
                </div>
            </div>

            <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold font-mono text-white">${spent.toLocaleString()}</span>
                <span className="text-slate-500 text-sm">de ${limit.toLocaleString()}</span>
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
                <div className="flex items-center gap-2 text-danger text-xs font-medium">
                    <AlertCircle size={14} />
                    <span>Has superado el límite por ${(spent - limit).toLocaleString()}</span>
                </div>
            )}
            {isWarning && (
                <div className="flex items-center gap-2 text-orange-400 text-xs font-medium">
                    <AlertCircle size={14} />
                    <span>Estás cerca de alcanzar el límite</span>
                </div>
            )}
        </motion.div>
    );
};

const Budgets = () => {
    // Mock budgets for now - in V3 we'll move this to context/Firebase
    const budgets = [
        { id: 1, category: 'Comida', spent: 150, limit: 200 },
        { id: 2, category: 'Transporte', spent: 45, limit: 50 },
        { id: 3, category: 'Ocio', spent: 120, limit: 100 },
        { id: 4, category: 'Hogar', spent: 300, limit: 500 },
    ];

    return (
        <Layout>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white">Presupuestos</h2>
                    <p className="text-slate-400">Controla tus gastos por categoría.</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-colors shadow-lg">
                    <Plus size={20} />
                    <span>Nuevo Límite</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {budgets.map(b => (
                    <BudgetCard key={b.id} {...b} />
                ))}
            </div>

            <div className="mt-12 bg-white/5 border border-white/10 p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <TrendingUp size={40} />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Consejo de Ahorro</h3>
                    <p className="text-slate-400">Este mes has reducido tus gastos en "Hogar" un 15% comparado con el mes anterior. ¡Sigue así para alcanzar tu meta de ahorros!</p>
                </div>
            </div>
        </Layout>
    );
};

export default Budgets;
