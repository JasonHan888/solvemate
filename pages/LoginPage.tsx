import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleGuest = () => {
    navigate('/app');
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 animate-scale-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8">Sign in to save your history and preferences.</p>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">or</span>
          </div>
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-3 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
          Continue as Guest <ArrowRight size={18} />
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          <span>Secure & Private Analysis</span>
        </div>
      </div>
    </div>
  );
};