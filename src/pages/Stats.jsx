import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const CategoryItem = ({ cat, index, totalExpense, transactions }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Get this category's expenses, most recent first
    const catTransactions = transactions
        .filter(t => t.category === cat.name && t.type === 'expense')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="flex flex-col gap-2">
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`bg-surface/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:bg-white/5 ${isExpanded ? 'ring-2 ring-primary/50 bg-surface/50 translate-x-2' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="font-semibold text-white">{cat.name}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-white">${cat.value.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                        {totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(1) : 0}% del total
                    </span>
                </div>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 pr-1 space-y-2 mb-4"
                    >
                        {catTransactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-white text-sm font-medium">{t.description}</span>
                                    <div className="text-[10px] text-slate-500 flex gap-2">
                                        <span className="capitalize">{new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date(t.date))}</span>
                                        <span>{new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(t.date))}</span>
                                    </div>
                                </div>
                                <span className="text-danger font-mono font-bold text-sm">-${t.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Stats = () => {
    const { transactions, expense } = useFinance();

    // Group expenses by category
    const categoryData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.category);
            if (existing) {
                existing.value += curr.amount;
            } else {
                acc.push({ name: curr.category, value: curr.amount });
            }
            return acc;
        }, [])
        .sort((a, b) => b.value - a.value);

    return (
        <Layout>
            <header className="mb-10">
                <h2 className="text-3xl font-bold text-white">Análisis de Gastos</h2>
                <p className="text-slate-400">Desglose visual y detallado de a dónde va tu dinero.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Left Side: Chart */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center relative shadow-2xl h-fit sticky top-6"
                >
                    <h3 className="text-xl font-bold mb-8 w-full text-left text-white/90">Distribución Mensual</h3>

                    {categoryData.length > 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
                            <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">Total Gastado</span>
                            <span className="text-3xl font-black text-white drop-shadow-lg">${expense.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    cornerRadius={10}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth={1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'Gasto']}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {categoryData.map((cat, i) => (
                            <div key={cat.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                {cat.name}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Detailed List */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xl font-bold text-white/90">Desglose Detallado</h3>
                        <span className="text-xs text-slate-500 font-medium italic">Toca para ver historial</span>
                    </div>

                    <div className="space-y-4">
                        {categoryData.map((cat, index) => (
                            <CategoryItem
                                key={cat.name}
                                cat={cat}
                                index={index}
                                totalExpense={expense}
                                transactions={transactions}
                            />
                        ))}

                        {categoryData.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-500 bg-white/5 border border-dashed border-white/10 rounded-[40px]">
                                <div className="p-4 rounded-full bg-white/5">
                                    <PieChart size={40} />
                                </div>
                                <p className="max-w-[200px] text-sm">No hay suficientes gastos para generar estadísticas aún.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Stats;
