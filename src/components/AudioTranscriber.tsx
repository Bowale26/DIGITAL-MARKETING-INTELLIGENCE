import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Upload, FileAudio, Play, Pause, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const languages = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Portuguese",
  "Igbo", "Hausa", "Twi", "Yoruba", "Swahili", "Zulu", "Amharic", "Hindi", "Russian"
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioTranscriber({ isOpen, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("File size exceeds 20MB limit.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      setTranscript('');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        resolve(base64String || '');
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleTranscribe = async () => {
    if (!file) return;

    setIsTranscribing(true);
    setError(null);

    try {
      const base64Data = await fileToBase64(file);
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data
                }
              },
              {
                text: `Transcribe this audio file accurately in ${selectedLanguage}. Include speaker labels (e.g. Speaker 1, Speaker 2) if multiple people are speaking. Format it cleanly with timestamps if possible.`
              }
            ]
          }
        ]
      });

      setTranscript(response.text || "Transcription completed but no text was returned.");
    } catch (err: any) {
      console.error("Transcription Error:", err);
      setError(err.message || "An error occurred during transcription.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <Mic size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight">Audio Intelligence</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Gemini 1.5 Flash</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!transcript && !isTranscribing ? (
                <div className="space-y-8">
                  <div 
                    className={cn(
                      "border-2 border-dashed rounded-[32px] p-12 text-center transition-all",
                      file ? "border-orange-500 bg-orange-500/5" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    )}
                  >
                    <input 
                      type="file" 
                      id="audio-upload" 
                      accept="audio/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer block group">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        {file ? <FileAudio size={32} className="text-orange-500" /> : <Upload size={32} className="text-slate-400" />}
                      </div>
                      <h3 className="text-sm font-bold mb-1">
                        {file ? file.name : "Select Audio File"}
                      </h3>
                      <p className="text-xs text-slate-400">Max 20MB. Supports MP3, WAV, AAC, etc.</p>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Target Language</label>
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 ring-orange-500 transition-all cursor-pointer"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    disabled={!file}
                    onClick={handleTranscribe}
                    className="w-full py-4 bg-orange-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    Transcribe Session
                  </button>
                </div>
              ) : isTranscribing ? (
                <div className="py-20 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Mic size={32} className="text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Processing Neural Audio...</h3>
                    <p className="text-xs text-slate-400">Analyzing voice patterns and generating transcript.</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {[0, 0.2, 0.4].map(delay => (
                      <motion.div 
                        key={delay}
                        animate={{ height: [8, 20, 8] }}
                        transition={{ duration: 1, repeat: Infinity, delay }}
                        className="w-1 bg-orange-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> Transcription Ready
                    </span>
                    <button 
                      onClick={() => {
                        setTranscript('');
                        setFile(null);
                      }}
                      className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> New Audit
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-950 rounded-[28px] p-6 border border-slate-100 dark:border-slate-800 h-[300px] overflow-y-auto no-scrollbar">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {transcript}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(transcript);
                        alert("Transcript copied to clipboard.");
                      }}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                    >
                      Copy Output
                    </button>
                    <button 
                      onClick={onClose}
                      className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                    >
                      Archive & Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
