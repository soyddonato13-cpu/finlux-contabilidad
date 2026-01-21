import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, CheckCircle } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useSound } from '../hooks/useSound';

const VoiceAssistant = () => {
    const { playClick, playSuccess } = useSound();
    const { isListening, startListening, message } = useVoiceAssistant(playSuccess);

    const handleStart = () => {
        playClick();
        startListening();
    };

    return (
        <div className="fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none">
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-primary text-[#0a192f] px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 text-sm"
                    >
                        <CheckCircle size={14} />
                        <span className="font-bold">{message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl pointer-events-auto transition-colors relative overflow-hidden ring-4 ring-background ${isListening ? 'bg-danger' : 'bg-primary'
                    }`}
            >
                {isListening ? (
                    <>
                        <MicOff size={24} />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-white/30 rounded-full"
                        />
                    </>
                ) : (
                    <Mic size={24} className="text-[#0a192f]" />
                )}
            </motion.button>
        </div>
    );
};

export default VoiceAssistant;
