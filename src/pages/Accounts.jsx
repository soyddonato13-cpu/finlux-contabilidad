import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Landmark, PiggyBank, Plus, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const iconMap = {
    Wallet: Wallet,
    Landmark: Landmark,
    PiggyBank: PiggyBank
};

const AccountCard = ({ acc, index }) => {
    const Icon = iconMap[acc.icon] || Wallet;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface/30 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex flex-col justify-between hover:bg-white/5 transition-colors group cursor-pointer"
        >
            <div className="flex justify-between items-start mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-emerald-500/10 text-primary border border-primary/20`}>
                    <Icon size={24} />
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                </div>
            </div>

            <div>
                <p className="text-slate-400 text-sm mb-1">{acc.name}</p>
                <h3 className="text-2xl font-bold font-mono text-white">${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
        </motion.div>
    );
};

const Accounts = () => {
    const { accounts, balance } = useFinance();

    return (
        <Layout>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white">Mis Cuentas</h2>
                    <p className="text-slate-400">Total combinado: <span className="text-white font-mono">${balance.toLocaleString()}</span></p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                    <Plus size={20} />
                    <span>Nueva Cuenta</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {accounts.map((acc, i) => (
                    <AccountCard key={acc.id} acc={acc} index={i} />
                ))}
            </div>

            <section className="mt-12 bg-primary/5 border border-primary/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Transfiere entre tus cuentas</h3>
                    <p className="text-slate-400 max-w-md">Mueve dinero de tu Banco a Efectivo o a tus Ahorros de forma instantánea y mantén todo bajo control.</p>
                </div>
                <div className="absolute right-[-5%] top-[-50%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
            </section>
        </Layout>
    );
};

export default Accounts;
