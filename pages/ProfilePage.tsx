import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
    const { user, resetPassword, signOut, sendOtp, verifyOtp } = useAuth();
    const { profile, refreshProfile } = useApp();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [showDeleteOtp, setShowDeleteOtp] = useState(false);
    const [deleteOtp, setDeleteOtp] = useState('');

    useEffect(() => {
        if (profile?.username) {
            setUsername(profile.username);
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!username || username.length < 3) {
            setMessage({ type: 'error', text: 'Username must be at least 3 characters long.' });
            setLoading(false);
            return;
        }

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

    const handleChangePasswordClick = async () => {
        if (!user?.email) return;
        if (!confirm("We will send a verification code (TAC) to your email to change your password. Continue?")) return;

        setLoading(true);
        try {
            await resetPassword(user.email);
            navigate(`/reset-password?email=${encodeURIComponent(user.email)}`);
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccountClick = async () => {
        if (!user?.email) return;
        // Initial confirmation
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        setLoading(true);
        try {
            // Send OTP
            await sendOtp(user.email);
            setShowDeleteOtp(true);
            setMessage({ type: 'success', text: 'Verification code sent to your email.' });
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!user?.email || !deleteOtp) return;

        setLoading(true);
        try {
            // Verify OTP first
            await verifyOtp(user.email, deleteOtp, 'email' as any);

            // If verify succeeds, proceed to delete
            const { error } = await supabase.rpc('delete_user');
            if (error) throw error;

            await signOut();
            alert("Your account has been deleted.");
            navigate('/login');
        } catch (error: any) {
            console.error("Error deleting account:", error);
            alert(error.message || "Error deleting account. Invalid code?");
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

                {/* Security Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                            <Lock size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">Security</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <h3 className="font-medium text-slate-700">Password</h3>
                                <p className="text-sm text-slate-500">Change your password via email verification.</p>
                            </div>
                            <button
                                onClick={handleChangePasswordClick}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                            >
                                Change Password
                            </button>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                {!showDeleteOtp ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-red-700">Delete Account</h3>
                                            <p className="text-sm text-red-500">Permanently delete your account and data.</p>
                                        </div>
                                        <button
                                            onClick={handleDeleteAccountClick}
                                            disabled={loading}
                                            className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 font-medium hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            Delete Account
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium text-red-700">Confirm Deletion</h3>
                                            <p className="text-sm text-red-500 mb-2">
                                                Please enter the verification code sent to <strong>{user?.email}</strong> to confirm account deletion.
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={deleteOtp}
                                                onChange={(e) => setDeleteOtp(e.target.value)}
                                                className="flex-grow px-4 py-2 rounded-lg border border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                                                placeholder="Enter OTP Code"
                                            />
                                            <button
                                                onClick={handleConfirmDelete}
                                                disabled={loading || !deleteOtp}
                                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-sm whitespace-nowrap"
                                            >
                                                {loading ? 'Deleting...' : 'Confirm Delete'}
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteOtp(false)}
                                                disabled={loading}
                                                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
