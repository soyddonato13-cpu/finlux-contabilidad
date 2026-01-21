import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where, addDoc, deleteDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const FinancialContext = createContext();

export const useFinance = () => useContext(FinancialContext);

export const FinancialProvider = ({ children }) => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([
        { id: 'acc_1', name: 'Efectivo', balance: 0, icon: 'Wallet' },
        { id: 'acc_2', name: 'Banco', balance: 0, icon: 'Landmark' },
        { id: 'acc_3', name: 'Ahorros', balance: 0, icon: 'PiggyBank' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Sync with Firestore if logged in, else LocalStorage
    useEffect(() => {
        if (!user) {
            const savedTrans = localStorage.getItem('finlux_transactions');
            const savedAccs = localStorage.getItem('finlux_accounts');
            if (savedTrans) setTransactions(JSON.parse(savedTrans));
            if (savedAccs) setAccounts(JSON.parse(savedAccs));
            return;
        }

        // Firestore Listeners
        const qTransactions = query(collection(db, 'users', user.uid, 'transactions'));
        const unsubTrans = onSnapshot(qTransactions, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qAccounts = query(collection(db, 'users', user.uid, 'accounts'));
        const unsubAccs = onSnapshot(qAccounts, (snapshot) => {
            if (snapshot.empty) {
                // Initialize default accounts in Firestore
                const defaults = [
                    { id: 'acc_1', name: 'Efectivo', balance: 0, icon: 'Wallet' },
                    { id: 'acc_2', name: 'Banco', balance: 0, icon: 'Landmark' },
                    { id: 'acc_3', name: 'Ahorros', balance: 0, icon: 'PiggyBank' },
                ];
                defaults.forEach(acc => {
                    setDoc(doc(db, 'users', user.uid, 'accounts', acc.id), acc);
                });
            } else {
                setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        });

        return () => {
            unsubTrans();
            unsubAccs();
        };
    }, [user]);

    // Persist to LocalStorage for offline/guest mode
    useEffect(() => {
        if (!user) {
            localStorage.setItem('finlux_transactions', JSON.stringify(transactions));
            localStorage.setItem('finlux_accounts', JSON.stringify(accounts));
        }
    }, [transactions, accounts, user]);

    // Derived State
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    const updateAccountBalance = async (accountId, amount, type) => {
        const acc = accounts.find(a => a.id === accountId);
        if (!acc) return;
        const newBalance = type === 'income' ? acc.balance + amount : acc.balance - amount;

        if (user) {
            await updateDoc(doc(db, 'users', user.uid, 'accounts', accountId), { balance: newBalance });
        } else {
            setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
        }
    };

    const addTransaction = async (transaction) => {
        console.log("Context: Attempting to add transaction:", transaction);
        try {
            const newTransaction = {
                date: new Date().toISOString(),
                ...transaction,
                amount: Number(transaction.amount) || 0
            };

            if (user) {
                console.log("Context: Saving to Firestore for user:", user.uid);
                await addDoc(collection(db, 'users', user.uid, 'transactions'), newTransaction);
            } else {
                console.log("Context: Saving to LocalStorage (Guest Mode)");
                setTransactions(prev => [{ id: Date.now(), ...newTransaction }, ...prev]);
            }

            await updateAccountBalance(transaction.accountId, newTransaction.amount, transaction.type);
            console.log("Context: Transaction added successfully");
            return true;
        } catch (error) {
            console.error("Context Error (addTransaction):", error);
            throw error;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const transaction = transactions.find(t => t.id === id);
            if (transaction) {
                await updateAccountBalance(transaction.accountId, transaction.amount, transaction.type === 'income' ? 'expense' : 'income');

                if (user) {
                    await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
                } else {
                    setTransactions(prev => prev.filter(t => t.id !== id));
                }
            }
        } catch (error) {
            console.error("Context Error (deleteTransaction):", error);
        }
    };

    const updateTransaction = async (id, updatedData) => {
        try {
            const oldTransaction = transactions.find(t => t.id === id);
            if (oldTransaction) {
                await updateAccountBalance(oldTransaction.accountId, oldTransaction.amount, oldTransaction.type === 'income' ? 'expense' : 'income');
                await updateAccountBalance(updatedData.accountId, updatedData.amount, updatedData.type);

                if (user) {
                    await updateDoc(doc(db, 'users', user.uid, 'transactions', id), updatedData);
                } else {
                    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
                }
            }
        } catch (error) {
            console.error("Context Error (updateTransaction):", error);
            throw error;
        }
    };

    const openModal = (transactionToEdit = null) => {
        setEditingTransaction(transactionToEdit);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(false);
    };

    return (
        <FinancialContext.Provider value={{
            transactions,
            accounts,
            balance: totalBalance,
            income,
            expense,
            addTransaction,
            deleteTransaction,
            updateTransaction,
            editingTransaction,
            isModalOpen,
            openModal,
            closeModal
        }}>
            {children}
        </FinancialContext.Provider>
    );
};
