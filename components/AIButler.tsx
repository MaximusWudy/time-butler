import React, { useState } from 'react';
import { Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { analyzeTimeLogs } from '../services/geminiService';
import { TimeLog, AIAnalysis } from '../types';

interface AIButlerProps {
  logs: TimeLog[];
}

const AIButler: React.FC<AIButlerProps> = ({ logs }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeTimeLogs(logs);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!analysis && !loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles size={24} className="text-yellow-300" />
            </div>
            <h3 className="text-xl font-bold">Time Butler AI</h3>
          </div>
          <p className="text-indigo-100 mb-6">
            Let me analyze your habits and give you personalized advice on how to optimize your day.
          </p>
          <button
            onClick={handleAnalyze}
            className="w-full bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Generate Insights
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-64 text-center">
        <div className="animate-spin text-indigo-600 mb-4">
          <RefreshCw size={32} />
        </div>
        <h4 className="text-lg font-semibold text-gray-800">Thinking...</h4>
        <p className="text-gray-500 text-sm">Reviewing your activity logs</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                <Sparkles size={18} className="text-indigo-600"/>
                Butler's Report
            </div>
            <button onClick={handleAnalyze} className="text-indigo-600 hover:text-indigo-800 p-1">
                <RefreshCw size={16} />
            </button>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Productivity Score</div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-gray-900">{analysis?.score}</span>
                        <span className="text-gray-400 mb-1">/ 100</span>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold">
                    {analysis?.score}%
                </div>
            </div>

            <div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Summary</div>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl text-sm">
                    {analysis?.summary}
                </p>
            </div>

            <div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Suggestions</div>
                <ul className="space-y-3">
                    {analysis?.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex gap-3 items-start">
                            <div className="mt-1 min-w-[20px] h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                            </div>
                            <span className="text-gray-700 text-sm">{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default AIButler;
