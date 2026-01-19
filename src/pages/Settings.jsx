import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Github } from 'lucide-react';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinancialContext';

const Settings = () => {
    const { transactions } = useFinance();

    const handleClearData = () => {
        if (confirm('¿Estás seguro de que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('finlux_transactions');
            window.location.reload();
        }
    };

    return (
        <Layout>
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white">Ajustes</h2>
                <p className="text-slate-400">Configuración global de la aplicación.</p>
            </header>

            <div className="max-w-2xl space-y-6">

                {/* Data Management Section */}
                <section className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                        <AlertTriangle className="text-accent" size={24} />
                        Zona de Peligro
                    </h3>
                    <p className="text-slate-400 mb-6 text-sm">
                        Aquí puedes reiniciar la aplicación a su estado de fábrica. Ten cuidado, esto borrará todas tus transacciones guardadas.
                    </p>

                    <button
                        onClick={handleClearData}
                        className="w-full py-3 rounded-xl bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-all font-bold flex items-center justify-center gap-2"
                    >
                        <Trash2 size={20} />
                        <span>Borrar Todos los Datos</span>
                    </button>
                </section>

                {/* About Section */}
                <section className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">FinLux v1.0</h3>
                    <p className="text-slate-500 text-sm mb-4">Desarrollado con ❤️ para Minino</p>
                    <div className="flex justify-center gap-4">
                        <span className="text-xs text-slate-600 bg-black/20 px-3 py-1 rounded-full">React</span>
                        <span className="text-xs text-slate-600 bg-black/20 px-3 py-1 rounded-full">Tailwind</span>
                        <span className="text-xs text-slate-600 bg-black/20 px-3 py-1 rounded-full">Framer</span>
                    </div>
                </section>

            </div>
        </Layout>
    );
};

export default Settings;
