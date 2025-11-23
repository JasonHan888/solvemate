import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Home, BookOpen, Cpu, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center w-full bg-slate-50">
      
      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Solve Problems in a <span className="text-blue-600 relative">
              Snap
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a photo of your technical issue, broken item, or homework question. 
            Our AI diagnostics will guide you to a solution instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/explanation')}
                className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Log In
              </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-5xl mx-auto px-6 mb-20 animate-slide-up delay-200">
        <h3 className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
          Works for everything
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <FeatureCard icon={<Monitor />} title="Tech Issues" desc="Hardware & Software" />
          <FeatureCard icon={<Home />} title="Home Repair" desc="Appliances & Fixtures" />
          <FeatureCard icon={<BookOpen />} title="Study Help" desc="Math & Science" />
          <FeatureCard icon={<Cpu />} title="Gadgets" desc="Phones & Electronics" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className="text-blue-500 mb-4 bg-blue-50 p-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
    </div>
    <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
    <p className="text-xs text-slate-500">{desc}</p>
  </div>
);