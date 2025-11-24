import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, ArrowRight, Trash2 } from 'lucide-react';

export const HistoryPage = () => {
  const { history, setCurrentAnalysis, deleteHistoryItems } = useApp();
  const navigate = useNavigate();
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());

  const handleSelect = (item: any) => {
    if (isSelectionMode) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      setSelectedItems(newSelected);
    } else {
      setCurrentAnalysis(item);
      navigate('/result');
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) {
      await deleteHistoryItems(Array.from(selectedItems));
      setIsSelectionMode(false);
      setSelectedItems(new Set());
    }
  };

  return (
    <div className="flex-grow w-full bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Clock size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">History</h1>
          </div>

          {history.length > 0 && (
            <div className="flex gap-2 self-end md:self-auto flex-wrap justify-end">
              {isSelectionMode ? (
                <>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.size === 0}
                    className="px-3 py-2 md:px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                  >
                    <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                    Delete ({selectedItems.size})
                  </button>
                  <button
                    onClick={() => {
                      if (selectedItems.size === history.length) {
                        setSelectedItems(new Set());
                      } else {
                        setSelectedItems(new Set(history.map(item => item.id)));
                      }
                    }}
                    className="px-3 py-2 md:px-4 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm md:text-base"
                  >
                    {selectedItems.size === history.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={toggleSelectionMode}
                    className="px-3 py-2 md:px-4 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleSelectionMode}
                  className="px-3 py-2 md:px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm md:text-base"
                >
                  Select
                </button>
              )}
            </div>
          )}
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
                className={`
                  bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer group flex gap-4 md:gap-6 items-start animate-slide-up relative
                  ${isSelectionMode && selectedItems.has(item.id) ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-slate-200 hover:shadow-md hover:border-blue-200'}
                `}
              >
                {isSelectionMode && (
                  <div className="absolute top-4 right-4">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${selectedItems.has(item.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}
                    `}>
                      {selectedItems.has(item.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </div>
                )}

                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                  <img src={item.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow min-w-0 py-1 pr-0 md:pr-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
                    <h3 className="font-bold text-slate-800 truncate pr-4 text-base md:text-lg">
                      {item.result.likelyCause}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 shrink-0 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 w-fit">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs md:text-sm line-clamp-2 mb-2 md:mb-3">
                    {item.result.summary}
                  </p>
                  {!isSelectionMode && (
                    <div className="flex items-center text-blue-600 text-xs md:text-sm font-semibold group-hover:underline">
                      View Solution <ArrowRight size={14} className="ml-1" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};