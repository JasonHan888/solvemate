import { supabase } from './supabaseClient';
import { HistoryItem } from '../types';

export const historyService = {
    async getHistory(userId: string): Promise<HistoryItem[]> {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            imageUrl: item.image_url,
            userDescription: item.user_description || '',
            result: item.result,
            timestamp: new Date(item.timestamp).getTime(),
        }));
    },

    async addToHistory(userId: string, item: HistoryItem): Promise<void> {
        const { error } = await supabase
            .from('history')
            .insert([
                {
                    user_id: userId,
                    image_url: item.imageUrl,
                    user_description: item.userDescription,
                    result: item.result,
                    timestamp: new Date(item.timestamp).toISOString(),
                },
            ]);

        if (error) {
            console.error('Error adding to history:', error);
            throw error;
        }
    },
};
