import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const ExplanationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How SolveMate Works</h1>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">Get your problems solved in three simple steps.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center transform transition-transform hover:scale-105 duration-300 animate-slide-up delay-100">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Camera size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">1. Snap a Photo</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Take a clear picture of the broken item, error message, or specific problem you are facing.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center transform transition-transform hover:scale-105 duration-300 relative z-10 animate-slide-up delay-200">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Cpu size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">2. AI Analysis</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Our advanced Gemini AI engine scans the visual data to diagnose the root cause instantly.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center transform transition-transform hover:scale-105 duration-300 animate-slide-up delay-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">3. Get Fixed</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Receive clear, step-by-step instructions to fix the problem yourself safely.</p>
          </div>
        </div>

        <div className="animate-fade-in delay-500">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 mx-auto active:scale-95"
          >
            Proceed to Login <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};