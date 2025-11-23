import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, ArrowRight, Trash2 } from 'lucide-react';

export const HistoryPage = () => {
  const { history, setCurrentAnalysis } = useApp();
  const navigate = useNavigate();

  const handleSelect = (item: any) => {
    setCurrentAnalysis(item);
    navigate('/result');
  };

  return (
    <div className="flex-grow w-full bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 animate-slide-up">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
             <Clock size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">History</h1>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200 animate-scale-in">
            <div className="inline-flex bg-slate-100 p-4 rounded-full text-slate-400 mb-4">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-medium text-slate-700 mb-2">No history yet</h3>
            <p className="text-slate-500 mb-6">Upload an image to start solving problems.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start New Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex gap-4 md:gap-6 items-start animate-slide-up"
              >
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                  <img src={item.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow min-w-0 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 truncate pr-4 text-lg">
                      {item.result.likelyCause}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 shrink-0 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                    {item.result.summary}
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:underline">
                    View Solution <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};