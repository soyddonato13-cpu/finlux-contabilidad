import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, CheckCircle } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const VoiceAssistant = () => {
    const { isListening, startListening, message } = useVoiceAssistant();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20"
                    >
                        <CheckCircle size={18} />
                        <span className="font-bold">{message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={startListening}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl pointer-events-auto transition-colors relative overflow-hidden ${isListening ? 'bg-danger' : 'bg-primary'
                    }`}
            >
                {isListening ? (
                    <>
                        <MicOff size={28} />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-white/30 rounded-full"
                        />
                    </>
                ) : (
                    <Mic size={28} />
                )}
            </motion.button>

            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold pr-2 bg-background/50 backdrop-blur-sm px-2 py-1 rounded-full">
                Asistente de Voz
            </p>
        </div>
    );
};

export default VoiceAssistant;
