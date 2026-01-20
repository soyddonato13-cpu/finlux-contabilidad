import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useFinance } from '../context/FinancialContext';

const TransactionModal = () => {
    const { isModalOpen, closeModal, addTransaction, updateTransaction, editingTransaction, accounts } = useFinance();
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [accountId, setAccountId] = useState(accounts[0]?.id || '');

    useEffect(() => {
        if (editingTransaction) {
            setType(editingTransaction.type);
            setAmount(editingTransaction.amount ? editingTransaction.amount.toString() : '');
            setDescription(editingTransaction.description);
            setCategory(editingTransaction.category);
            setAccountId(editingTransaction.accountId);
        } else {
            setType('expense');
            setAmount('');
            setDescription('');
            setCategory('');
            setAccountId(accounts[0]?.id || '');
        }
    }, [editingTransaction, isModalOpen, accounts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description || !accountId) return;

        const transactionData = {
            type,
            amount: parseFloat(amount),
            description,
            category: category || 'General',
            accountId
        };

        if (editingTransaction) {
            updateTransaction(editingTransaction.id, transactionData);
        } else {
            addTransaction(transactionData);
        }

        closeModal();
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-x-4 bottom-4 md:inset-0 md:m-auto w-auto md:w-full md:max-w-md h-fit z-50 md:p-6"
                    >
                        <div className="bg-surface border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            {/* Decorative Glow */}
                            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${type === 'income' ? 'from-primary to-emerald-300' : 'from-danger to-orange-400'}`} />

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingTransaction ? 'Editar Movimiento' : 'Nuevo Movimiento'}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Type Selector */}
                                <div className="flex bg-background rounded-xl p-1 border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setType('expense')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === 'expense' ? 'bg-surface shadow text-danger' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Gasto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('income')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === 'income' ? 'bg-surface shadow text-primary' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Ingreso
                                    </button>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Monto</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-background border border-white/10 rounded-xl py-4 pl-10 pr-4 text-2xl font-mono text-white focus:outline-none focus:border-primary/50 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Account Selector */}
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Cuenta</label>
                                    <select
                                        value={accountId}
                                        onChange={(e) => setAccountId(e.target.value)}
                                        className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    >
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description Input */}
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Descripción</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ej: Cena con amigos..."
                                        className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white text-base md:text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>

                                {/* Category (Simplified for now) */}
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Categoría</label>
                                    <div className="flex gap-2 overflow-x-auto pb-4 noscroll">
                                        {['Comida', 'Transporte', 'Hogar', 'Ocio', 'Salud', 'Servicios', 'Educación', 'Compras', 'Inversiones', 'Mantenimiento'].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${category === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 mt-4 ${type === 'income' ? 'bg-primary text-white shadow-primary/25' : 'bg-danger text-white shadow-danger/25'}`}
                                >
                                    <Check size={20} />
                                    <span>{editingTransaction ? 'Guardar Cambios' : 'Guardar Transacción'}</span>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TransactionModal;
