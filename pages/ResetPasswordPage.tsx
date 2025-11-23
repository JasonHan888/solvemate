import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { verifyOtp, updatePassword } = useAuth();

    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState<'otp' | 'password'>('otp');
    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We assume 'recovery' type for password reset flows
            await verifyOtp(email, otp, 'recovery');
            setStep('password');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePassword(newPassword);
            alert("Password updated successfully! Please login with your new password.");
            navigate('/login');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex flex-col items-center justify-center w-full bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
                    {step === 'otp' ? 'Verify Identity' : 'Set New Password'}
                </h2>
                <p className="text-slate-500 text-center mb-8">
                    {step === 'otp'
                        ? `Enter the code sent to ${email}`
                        : 'Create a strong password for your account.'}
                </p>

                {step === 'otp' ? (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
                                placeholder="you@example.com"
                                required
                                readOnly={!!searchParams.get('email')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Verification Code (TAC)</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none tracking-widest"
                                    placeholder="123456"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'} <ArrowRight size={18} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
