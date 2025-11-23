import React, { useState, useEffect } from 'react';
import { User, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';

export const ProfilePage = () => {
    const { user, updatePassword } = useAuth();
    const { profile, refreshProfile } = useApp();

    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (profile?.username) {
            setUsername(profile.username);
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    username,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            await refreshProfile();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error updating profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await updatePassword(newPassword);
            setNewPassword('');
            setMessage({ type: 'success', text: 'Password updated successfully!' });
        } catch (error: any) {
            // Error handled in context usually, but we catch here too
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow w-full bg-slate-50 px-4 py-12">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                            <User size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="Choose a username"
                                minLength={3}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={18} />
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                            <Lock size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">Security</h2>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="Enter new password"
                                minLength={6}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || !newPassword}
                                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={18} />
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};
