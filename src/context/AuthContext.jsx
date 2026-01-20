import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Handle redirect result for mobile
        getRedirectResult(auth).catch((error) => {
            console.error("Redirect Auth Error:", error);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            // Check if mobile (simplistic but effective for this case)
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                return await signInWithRedirect(auth, googleProvider);
            } else {
                return await signInWithPopup(auth, googleProvider);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error al iniciar sesión: Asegúrate de que el dominio de tu web esté autorizado en Firebase.");
        }
    };

    const logout = async () => {
        await signOut(auth);
        window.location.reload(); // Hard reset to clear all context states
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
