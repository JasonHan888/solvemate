import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Search, ArrowRight, RotateCcw, AlertOctagon, Download, Volume2, Square, Copy, Check } from 'lucide-react';

export const ResultPage = () => {
  const { currentAnalysis } = useApp();
  const navigate = useNavigate();

  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Cleanup speech when leaving page
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!currentAnalysis) {
    return <Navigate to="/app" replace />;
  }

  const { result, imageUrl, userDescription } = currentAnalysis;

  const handleDownload = () => {
    if (!currentAnalysis) return;

    try {
      const jsonString = JSON.stringify(currentAnalysis, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `solvemate-analysis-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download result", e);
      alert("Could not save the file.");
    }
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToRead = `
        Problem Summary: ${result.summary}. 
        Likely Cause: ${result.likelyCause}. 
        Solution Steps: ${result.solutionSteps.join('. ')}. 
        ${result.warnings.length > 0 ? `Warnings: ${result.warnings.join('. ')}` : ''}
      `;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsPlaying(false);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleCopy = () => {
    const text = `PROBLEM: ${result.summary}\n\nCAUSE: ${result.likelyCause}\n\nSOLUTION STEPS:\n${result.solutionSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWARNINGS:\n${result.warnings.join('\n')}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-grow w-full bg-slate-50 py-6 px-4 sm:px-6 md:py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

        {/* Left Column: Input Context */}
        <div className="lg:col-span-5 space-y-6 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-700">Your Input</h3>
            </div>
            <div className="p-4">
              <div className="bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-4">
                <img
                  src={imageUrl}
                  alt="Problem"
                  className="w-full h-auto object-cover max-h-[300px] md:max-h-[400px]"
                />
              </div>
              {userDescription && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-800 mb-1">Description:</p>
                  <p className="text-slate-700 text-sm italic">"{userDescription}"</p>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => navigate('/app')}
                  className="w-full py-3 px-4 bg-white border-2 border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <RotateCcw size={18} /> Ask Another Question
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 bg-white border-2 border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                  title="Save analysis result as JSON"
                >
                  <Download size={18} /> Save Result (JSON)
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="lg:col-span-7 space-y-6">

          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-md border-l-4 border-blue-500 overflow-hidden animate-slide-up delay-100">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg md:text-xl font-bold text-slate-800">Problem Summary</h2>
                <div className="flex gap-2">
                  <button
                    onClick={toggleSpeech}
                    className={`p-2 rounded-full transition-colors ${isPlaying ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'}`}
                    title={isPlaying ? "Stop Reading" : "Read Aloud"}
                  >
                    {isPlaying ? <Square size={20} fill="currentColor" /> : <Volume2 size={20} />}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                    title="Copy Solution to Clipboard"
                  >
                    {isCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">{result.summary}</p>
            </div>
          </div>

          {/* Likely Cause Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-slide-up delay-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full shrink-0">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Likely Cause</h3>
                <p className="text-slate-700 font-medium">{result.likelyCause}</p>
              </div>
            </div>
          </div>

          {/* Solution Steps */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-slide-up delay-300">
            <div className="px-6 py-4 border-b border-slate-100 bg-green-50/50 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={20} />
              <h3 className="font-bold text-slate-800">Recommended Solution</h3>
            </div>
            <div className="p-6">
              <ol className="space-y-4">
                {result.solutionSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-slate-700 mt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-6 animate-slide-up delay-400">
              <div className="flex items-center gap-2 mb-3 text-red-700">
                <AlertOctagon size={20} />
                <h3 className="font-bold">Important Warnings</h3>
              </div>
              <ul className="space-y-2">
                {result.warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 animate-slide-up delay-500">
            {/* Alternative Causes */}
            {result.alternativeCauses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" /> Alternatives
                </h3>
                <ul className="space-y-2">
                  {result.alternativeCauses.map((cause, idx) => (
                    <li key={idx} className="text-sm text-slate-600 border-l-2 border-slate-200 pl-3">
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-3">Google Searches</h3>
              <div className="flex flex-col gap-2">
                {result.searchQueries.map((query, idx) => (
                  <a
                    key={idx}
                    href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-slate-700 transition-colors group"
                  >
                    <span className="truncate mr-2">{query}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};