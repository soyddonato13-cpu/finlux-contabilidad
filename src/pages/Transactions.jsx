import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Trash2, Edit, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const Transactions = () => {
    const { transactions, deleteTransaction, openModal, accounts } = useFinance();
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [accountFilter, setAccountFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Comida', 'Transporte', 'Hogar', 'Ocio', 'Salud', 'General'];

    const exportToCSV = () => {
        const headers = ['Fecha,Hora,Día,Descripción,Categoría,Cuenta,Tipo,Monto'];
        const rows = transactions.map(t => {
            const dateObj = new Date(t.date);
            return [
                dateObj.toLocaleDateString(),
                dateObj.toLocaleTimeString(),
                new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(dateObj),
                t.description,
                t.category,
                accounts.find(a => a.id === t.accountId)?.name || 'General',
                t.type === 'income' ? 'Ingreso' : 'Gasto',
                t.amount
            ].join(',');
        });

        const csvContent = headers.concat(rows).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'finlux_report_detallado.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('FinLux - Reporte Detallado de Movimientos', 14, 15);
        doc.autoTable({
            startY: 20,
            head: [['Fecha', 'Día', 'Descripción', 'Categoría', 'Cuenta', 'Tipo', 'Monto']],
            body: transactions.map(t => {
                const dateObj = new Date(t.date);
                return [
                    dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(dateObj),
                    t.description,
                    t.category,
                    accounts.find(a => a.id === t.accountId)?.name || 'General',
                    t.type === 'income' ? 'Ingreso' : 'Gasto',
                    `$${t.amount.toLocaleString()}`
                ];
            }),
        });
        doc.save('finlux_report_detallado.pdf');
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
        const matchesAccount = accountFilter === 'all' || t.accountId === accountFilter;
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesCategory && matchesAccount && matchesSearch;
    });

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
            deleteTransaction(id);
        }
    };

    return (
        <Layout>
            <header className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Historial Detallado</h2>
                        <p className="text-slate-400">Revisa fecha, hora y detalles de cada movimiento.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                        >
                            <Download size={16} />
                            <span>CSV</span>
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                        >
                            <FileText size={16} />
                            <span>PDF</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div className="relative col-span-2 lg:col-span-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-surface/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary/50 transition-all hover:bg-white/5"
                    >
                        <option value="all">Todos los Tipos</option>
                        <option value="income">Solo Ingresos</option>
                        <option value="expense">Solo Gastos</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-surface/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary/50 transition-all hover:bg-white/5"
                    >
                        <option value="all">Categorías</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <select
                        value={accountFilter}
                        onChange={(e) => setAccountFilter(e.target.value)}
                        className="bg-surface/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary/50 transition-all hover:bg-white/5"
                    >
                        <option value="all">Todas las Cuentas</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>
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
                                                <div>
                                                    <span className="font-medium text-white block">{t.description}</span>
                                                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tight">
                                                        {accounts.find(a => a.id === t.accountId)?.name || 'Cuenta General'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/5 text-slate-300">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-medium capitalize">
                                                    {new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date(t.date))}
                                                </span>
                                                <span className="text-slate-400 text-xs">
                                                    {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(t.date))}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`p-6 text-right font-mono font-medium ${t.type === 'income' ? 'text-primary' : 'text-danger'}`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openModal(t)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-2 hover:bg-danger/20 rounded-lg transition-colors text-slate-400 hover:text-danger"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
