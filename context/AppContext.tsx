import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { AnalysisResult, HistoryItem } from '../types';
import { useAuth } from './AuthContext';
import { historyService } from '../services/historyService';

interface User {
  email: string;
}

interface AppContextType {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  currentAnalysis: HistoryItem | null;
  setCurrentAnalysis: (item: HistoryItem | null) => void;
  user: any | null; // Using any to match AuthContext user or custom user
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<HistoryItem | null>(null);
  const { user } = useAuth();

  // Load history from Supabase if logged in, or local storage if not (optional, or just clear)
  useEffect(() => {
    if (user) {
      historyService.getHistory(user.id).then(setHistory);
    } else {
      // Optional: Load local history for guest, or just empty
      // setHistory([]); 
      try {
        const storedHistory = localStorage.getItem('snapsolve_history');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error("Failed to load local storage data", e);
      }
    }
  }, [user]);

  const addToHistory = async (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);

    if (user) {
      try {
        await historyService.addToHistory(user.id, item);
      } catch (error) {
        console.error("Failed to save to Supabase history", error);
      }
    } else {
      // Save locally for guest
      try {
        const currentHistory = JSON.parse(localStorage.getItem('snapsolve_history') || '[]');
        const newHistory = [item, ...currentHistory].slice(0, 10);
        localStorage.setItem('snapsolve_history', JSON.stringify(newHistory));
      } catch (e) {
        console.warn("Storage quota exceeded, could not save to local history");
      }
    }
  };

  return (
    <AppContext.Provider value={{ history, addToHistory, currentAnalysis, setCurrentAnalysis, user }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
