import React, { createContext, useContext, useState, useEffect } from 'react';

const FinancialContext = createContext();

export const useFinance = () => useContext(FinancialContext);

export const FinancialProvider = ({ children }) => {
    // Load from localStorage or use default mock data
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('finlux_transactions');
        return saved ? JSON.parse(saved) : [
            { id: 1, type: 'expense', amount: 120.50, category: 'Alimentación', description: 'Compra en Supermercado', date: new Date().toISOString() },
            { id: 2, type: 'income', amount: 2500.00, category: 'Salario', description: 'Pago de Nómina', date: new Date(Date.now() - 86400000).toISOString() },
        ];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Persist to LocalStorage
    useEffect(() => {
        localStorage.setItem('finlux_transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Derived State
    const balance = transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    const addTransaction = (transaction) => {
        const newTransaction = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...transaction
        };
        setTransactions([newTransaction, ...transactions]);

        // Play sound here later
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <FinancialContext.Provider value={{
            transactions,
            balance,
            income,
            expense,
            addTransaction,
            isModalOpen,
            openModal,
            closeModal
        }}>
            {children}
        </FinancialContext.Provider>
    );
};
