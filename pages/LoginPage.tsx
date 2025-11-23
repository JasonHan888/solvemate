import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, Mail, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, verifyOtp, resetPassword, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpType, setOtpType] = useState<'signup' | 'recovery'>('signup');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (showOtp) {
        await verifyOtp(email, otp, otpType);
        // After verifying, if it was recovery, we might want to redirect to profile to change password
        // But for now, verifyOtp usually logs the user in.
      } else if (isSignUp) {
        await signUpWithEmail(email, password);
        setShowOtp(true);
        setOtpType('signup');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setShowOtp(true);
      setOtpType('recovery');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 animate-scale-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
          {showOtp ? 'Enter Verification Code' : (isSignUp ? 'Create Account' : 'Welcome Back')}
        </h2>
        <p className="text-slate-500 text-center mb-8">
          {showOtp
            ? `We sent a code to ${email}`
            : (isSignUp ? 'Sign up to start saving your history.' : 'Sign in to save your history and preferences.')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {!showOtp && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              {!isSignUp && ( // Only show password for login, signup will set password after? Or set it now? 
                // Standard flow: Signup with email/pass -> Verify OTP.
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {showOtp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">One-Time Password (OTP)</label>
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
          )}

          {!isSignUp && !showOtp && (
            <div className="flex justify-end">
              <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (showOtp ? 'Verify & Login' : (isSignUp ? 'Sign Up' : 'Sign In'))}
          </button>
        </form>

        {!showOtp && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Sign in with Google
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-blue-600 font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-4 text-center text-sm">
              <button
                onClick={() => { setShowOtp(true); setOtpType('signup'); }}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                I already have a verification code
              </button>
            </div>
          </>
        )}

        {showOtp && (
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setShowOtp(false)}
              className="text-slate-500 hover:text-slate-700 underline"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          <span>Secure & Private Analysis</span>
        </div>
      </div>
    </div>
  );
};