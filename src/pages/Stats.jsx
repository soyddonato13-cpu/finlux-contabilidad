import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

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
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white">Estadísticas</h2>
                <p className="text-slate-400">Desglose de tus gastos por categoría.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Pie Chart Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 h-[400px] flex flex-col items-center justify-center relative shadow-xl"
                >
                    <h3 className="text-lg font-semibold mb-4 w-full text-left">Distribución de Gastos</h3>

                    {categoryData.length > 0 ? (
                        <text className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold opacity-20 pointer-events-none">
                            ${expense.toLocaleString()}
                        </text>
                    ) : null}

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                formatter={(value) => `$${value.toFixed(2)}`}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Top Categories List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold px-2">Categorías Principales</h3>
                    {categoryData.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-surface/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="font-medium">{cat.name}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-mono font-bold">${cat.value.toFixed(2)}</span>
                                <span className="text-xs text-slate-500">{expense > 0 ? ((cat.value / expense) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </motion.div>
                    ))}

                    {categoryData.length === 0 && (
                        <div className="p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                            No hay suficientes datos de gastos para mostrar estadísticas.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Stats;
