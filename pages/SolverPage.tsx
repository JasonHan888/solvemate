import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Loader2, ArrowRight, Camera, X, Mic, MicOff, ChevronDown, Zap, ZapOff } from 'lucide-react';
import { analyzeProblem } from '../services/geminiService';
import { useApp } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = [
  "General",
  "Technology & Computers",
  "Home Appliances",
  "Automotive & Mechanic",
  "Plumbing & HVAC",
  "DIY & Construction",
  "Gardening & Plants"
];

export const SolverPage = () => {
  const navigate = useNavigate();
  const { setCurrentAnalysis, addToHistory, user } = useApp();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null); // For SpeechRecognition

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup stream on unmount
    return () => {
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File is too large. Please upload an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;

      // Check for flash (torch) capability
      const track = stream.getVideoTracks()[0];
      const capabilities = (track as any).getCapabilities ? (track as any).getCapabilities() : {};

      // Check if 'torch' is in capabilities
      if ('torch' in capabilities) {
        setHasFlash(true);
      } else {
        setHasFlash(false);
      }
      setIsFlashOn(false);

      setIsCameraOpen(true);
      // Wait for state update and render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setIsFlashOn(false);
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const newFlashState = !isFlashOn;
      await track.applyConstraints({
        advanced: [{ torch: newFlashState } as any]
      });
      setIsFlashOn(newFlashState);
    } catch (err) {
      console.error("Error toggling flash:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null); // Clear any previous errors
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);

      // Handle "no-speech" gracefully
      if (event.error === 'no-speech') {
        return;
      }

      if (event.error === 'aborted') {
        return;
      }

      console.error("Speech recognition error", event.error);

      if (event.error === 'not-allowed') {
        setError("Microphone permission denied. Please allow microphone access.");
      } else if (event.error === 'audio-capture') {
        setError("No microphone found.");
      } else {
        setError("Voice input error. Please try typing instead.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition", e);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeProblem(selectedImage, description, category);

      const newItem = {
        id: uuidv4(),
        timestamp: Date.now(),
        imageUrl: selectedImage,
        userDescription: description,
        result: result,
      };

      setCurrentAnalysis(newItem);
      if (user) {
        addToHistory(newItem);
      }

      navigate('/result');
    } catch (err) {
      setError("Analysis failed. Please try again. Make sure your API key is valid.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-grow flex flex-col items-center w-full bg-slate-50 relative">

      {/* Camera Modal Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col animate-fade-in">
          <div className="relative flex-grow flex items-center justify-center bg-black overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

            {/* Flash Toggle Button */}
            {hasFlash && (
              <button
                onClick={toggleFlash}
                className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md z-10 transition-all duration-200 ${isFlashOn ? 'bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-black/40 text-white hover:bg-black/60'}`}
                title={isFlashOn ? "Turn Flash Off" : "Turn Flash On"}
              >
                {isFlashOn ? <Zap size={24} fill="currentColor" /> : <ZapOff size={24} />}
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 p-3 bg-black/40 text-white rounded-full backdrop-blur-md z-10 hover:bg-black/60 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="bg-black p-6 flex justify-center items-center pb-10">
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors active:scale-95"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-lg"></div>
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto px-4 py-10 animate-slide-up">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">New Analysis</h2>
          <p className="text-slate-500">Upload an image to identify the problem.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">

          <div className="p-6 md:p-8">
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Problem Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Upload Zone */}
            <div
              onClick={triggerFileUpload}
              className={`
                group relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300
                ${selectedImage ? 'border-blue-300 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              {selectedImage ? (
                <div className="relative animate-scale-in">
                  <img src={selectedImage} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg gap-4">
                    <p className="text-white font-medium flex items-center gap-2">
                      <UploadCloud size={20} /> Change File
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-slate-400 text-sm mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>

                  <div className="relative w-full max-w-xs my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-slate-400 font-medium">OR</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Camera size={18} /> Take Photo
                  </button>
                </div>
              )}
            </div>

            {/* Allow changing photo via camera if image is selected */}
            {selectedImage && (
              <div className="flex justify-center mt-4 gap-3 animate-fade-in">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 underline"
                >
                  Clear Image
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Camera size={16} /> Retake with Camera
                </button>
              </div>
            )}

            {/* Description Input with Voice */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Describe the problem (optional)
                </label>
                <button
                  onClick={toggleVoiceInput}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  title="Use Voice Input"
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  {isListening ? 'Listening...' : 'Voice Input'}
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. My PC won't turn on and makes a beeping sound..."
                  className={`w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none h-24 text-slate-700 placeholder:text-slate-400 ${isListening ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-scale-in">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || !selectedImage}
              className={`
                w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20
                ${!selectedImage
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isAnalyzing
                    ? 'bg-blue-600/90 text-white cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/30 transform active:scale-[0.98]'}
              `}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span className="animate-pulse">Analyzing...</span>
                </>
              ) : (
                <>
                  Analyze Problem <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};