import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { AnalysisResult, HistoryItem } from '../types';
import { useAuth } from './AuthContext';
import { historyService } from '../services/historyService';

interface UserProfile {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

interface AppContextType {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  currentAnalysis: HistoryItem | null;
  setCurrentAnalysis: (item: HistoryItem | null) => void;
  user: any | null;
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
}
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<HistoryItem | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore not found error
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in refreshProfile:', error);
    }
  };

  useEffect(() => {
    if (user) {
      historyService.getHistory(user.id).then(setHistory);
      refreshProfile();
    } else {
      setHistory([]);
      setProfile(null);
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
      // No guest mode storage anymore
      console.warn("User not logged in, cannot save history.");
    }
  };

  return (
    <AppContext.Provider value={{ history, addToHistory, currentAnalysis, setCurrentAnalysis, user, profile, refreshProfile }}>
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
