import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const StatCard = ({ title, amount, trend, isPositive, delay }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-surface/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl hover:bg-white/5 transition-colors group cursor-default relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {isPositive ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
        </div>

        <h3 className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-1">{title}</h3>
        <div className="text-3xl font-bold text-white mb-2 font-mono">
            {amount}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-primary' : 'text-danger'}`}>
            <span>{trend}</span>
            <span className="text-slate-500 font-normal">vs mes pasado</span>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { balance, income, expense, transactions } = useFinance();

    return (
        <Layout>
            <header className="mb-8">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-white"
                >
                    Bienvenido de nuevo, <span className="text-primary">Minino</span>
                </motion.h2>
                <p className="text-slate-400">Aquí está el resumen financiero de hoy.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Balance Total" amount={`$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} trend="+0%" isPositive={true} delay={0.1} />
                <StatCard title="Ingresos (Global)" amount={`$${income.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} trend="" isPositive={true} delay={0.2} />
                <StatCard title="Gastos (Global)" amount={`$${expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} trend="" isPositive={false} delay={0.3} />
            </div>

            {/* Main Chart Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 h-80 md:h-96 flex flex-col relative overflow-hidden"
            >
                <div className="mb-6 relative z-10">
                    <h3 className="text-xl font-semibold mb-1">Análisis Financiero</h3>
                    <p className="text-slate-400 text-sm">Flujo de efectivo acumulado</p>
                </div>

                <div className="flex-1 w-full h-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={transactions.slice().reverse()}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            </motion.div>

            {/* Recent Transactions Preview */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Movimientos Recientes</h3>
                    <button className="text-sm text-primary hover:text-emerald-400 transition-colors">Ver todos</button>
                </div>

                <div className="space-y-3">
                    {transactions.slice(0, 5).map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (index * 0.1) }}
                            className="flex justify-between items-center p-4 rounded-2xl bg-surface/30 border border-transparent hover:border-white/10 hover:bg-surface/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}`}>
                                    <DollarSign size={18} />
                                </div>
                                <div>
                                    <div className="font-medium text-white">{item.description}</div>
                                    <div className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()} • {item.category}</div>
                                </div>
                            </div>
                            <div className={`font-mono font-medium ${item.type === 'income' ? 'text-primary' : 'text-danger'}`}>
                                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
