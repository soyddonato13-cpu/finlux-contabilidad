import { useState, useCallback } from 'react';
import { useFinance } from '../context/FinancialContext';

const CATEGORY_MAP = {
    'transporte': ['gasolina', 'camioneta', 'pasaje', 'taxi', 'uber', 'bus', 'carro', 'moto', 'viaje'],
    'comida': ['almuerzo', 'cena', 'mercado', 'super', 'pan', 'restaurante', 'comida', 'hambre', 'merienda'],
    'hogar': ['luz', 'agua', 'alquiler', 'renta', 'casa', 'internet', 'limpieza', 'mueble'],
    'ocio': ['cine', 'fiesta', 'cerveza', 'juego', 'diversión', 'regalo'],
    'salud': ['farmacia', 'médico', 'clínica', 'pastillas', 'dentista', 'hospital']
};

export const useVoiceAssistant = () => {
    const { addTransaction, accounts } = useFinance();
    const [isListening, setIsListening] = useState(false);
    const [message, setMessage] = useState('');

    const parseCommand = (text) => {
        const lowerText = text.toLowerCase();

        // Find Amount
        const amountMatch = lowerText.match(/\d+(\.\d+)?/);
        const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

        // Find Type
        let type = 'expense';
        if (lowerText.includes('gané') || lowerText.includes('ingreso') || lowerText.includes('recibí') || lowerText.includes('cobré')) {
            type = 'income';
        }

        // Find Category (Smart Mapping)
        let category = 'General';
        for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
            if (keywords.some(k => lowerText.includes(k))) {
                category = cat.charAt(0).toUpperCase() + cat.slice(1);
                break;
            }
        }

        return { amount, type, category, original: text };
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Tu navegador no soporta reconocimiento de voz. Intenta con Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            const parsed = parseCommand(transcript);

            if (parsed.amount) {
                await addTransaction({
                    amount: parsed.amount,
                    type: parsed.type,
                    category: parsed.category,
                    description: transcript,
                    accountId: accounts[0]?.id || 'acc_1'
                });
                setMessage(`¡Listo abuelo! Guardado: $${parsed.amount} en ${parsed.category}`);
            } else {
                setMessage('No pude entender el monto. Intenta decir "Gasté 20 dólares..."');
            }

            setTimeout(() => setMessage(''), 5000);
        };

        recognition.start();
    };

    return { isListening, startListening, message };
};
