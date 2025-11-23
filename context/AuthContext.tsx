import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    verifyOtp: (email: string, token: string, type: 'signup' | 'recovery') => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    sendOtp: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            console.log("Initiating Google Sign-In...");
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Google:", error);
            alert("Error signing in with Google. Please try again.");
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Error signing in:", error);
            alert(error.message || "Error signing in");
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                // options: { emailRedirectTo: ... } // Not needed for OTP
            });
            if (error) throw error;
            alert("Check your email for the OTP code!");
        } catch (error: any) {
            console.error("Error signing up:", error);
            alert(error.message || "Error signing up");
            throw error;
        }
    };

    const verifyOtp = async (email: string, token: string, type: 'signup' | 'recovery') => {
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type,
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Error verifying OTP:", error);
            alert(error.message || "Error verifying OTP");
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            alert("Check your email for the OTP code!");
        } catch (error: any) {
            console.error("Error resetting password:", error);
            alert(error.message || "Error resetting password");
            throw error;
        }
    };

    const updatePassword = async (password: string) => {
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            alert("Password updated successfully!");
        } catch (error: any) {
            console.error("Error updating password:", error);
            alert(error.message || "Error updating password");
            throw error;
        }
    };

    const sendOtp = async (email: string) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false }
            });
            if (error) throw error;
            alert("Check your email for the OTP code!");
        } catch (error: any) {
            console.error("Error sending OTP:", error);
            alert(error.message || "Error sending OTP");
            throw error;
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, verifyOtp, resetPassword, updatePassword, sendOtp, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
