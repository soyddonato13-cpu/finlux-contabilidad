import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const Transactions = () => {
    const { transactions } = useFinance();
    const [filter, setFilter] = useState('all'); // all, income, expense
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions.filter(t => {
        const matchesFilter = filter === 'all' || t.type === filter;
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <Layout>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Historial de Movimientos</h2>
                    <p className="text-slate-400">Gestiona y revisa todas tus transacciones.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-48 transition-all"
                        />
                    </div>
                    <div className="bg-surface/50 border border-white/10 rounded-xl p-1 flex">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilter('income')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === 'income' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'}`}
                        >
                            Ingresos
                        </button>
                        <button
                            onClick={() => setFilter('expense')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === 'expense' ? 'bg-danger/20 text-danger' : 'text-slate-400 hover:text-white'}`}
                        >
                            Gastos
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-6 font-medium">Transacción</th>
                                <th className="p-6 font-medium">Categoría</th>
                                <th className="p-6 font-medium">Fecha</th>
                                <th className="p-6 font-medium text-right">Monto</th>
                                <th className="p-6 font-medium text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((t, i) => (
                                    <motion.tr
                                        key={t.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                                                    {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                                </div>
                                                <span className="font-medium text-white">{t.description}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/5 text-slate-300">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="p-6 text-slate-400 text-sm">
                                            {new Date(t.date).toLocaleDateString()}
                                        </td>
                                        <td className={`p-6 text-right font-mono font-medium ${t.type === 'income' ? 'text-primary' : 'text-danger'}`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </td>
                                        <td className="p-6 text-center">
                                            <button className="p-2 hover:bg-danger/20 hover:text-danger rounded-lg text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-500">
                                        No se encontraron transacciones.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Transactions;
