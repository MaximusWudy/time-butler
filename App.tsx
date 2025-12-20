import React, { useState, useEffect } from 'react';
import { ActivityType, TimeLog } from './types';
import { getLogs, saveLog, getCurrentLog, saveCurrentLog } from './services/storageService';
import StatusButton from './components/StatusButton';
import TimerDisplay from './components/TimerDisplay';
import { Charts } from './components/Charts';
import AIButler from './components/AIButler';
import { Clock, BarChart2, Settings, User, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'reports' | 'settings'>('tracker');
  const [currentLog, setCurrentLog] = useState<TimeLog | null>(null);
  const [logs, setLogs] = useState<TimeLog[]>([]);

  // Initialize data
  useEffect(() => {
    getLogs().then(setLogs);
    const savedCurrent = getCurrentLog();
    if (savedCurrent) {
      setCurrentLog(savedCurrent);
    }
  }, []);

  // Update storage whenever current log changes
  useEffect(() => {
    saveCurrentLog(currentLog);
  }, [currentLog]);

  const handleSwitchStatus = (type: string) => {
    const now = Date.now();

    // If there is an active log, close it
    if (currentLog) {
      // If clicking the same status, do nothing (or could toggle off to 'idle' if we wanted)
      if (currentLog.activityType === type) return;

      const finishedLog: TimeLog = {
        ...currentLog,
        endTime: now,
        duration: Math.floor((now - currentLog.startTime) / 1000)
      };
      
      saveLog(finishedLog);
      setLogs(prev => [finishedLog, ...prev]);
    }

    // Start new log
    const newLog: TimeLog = {
      id: crypto.randomUUID(),
      activityType: type,
      startTime: now,
      endTime: null,
      duration: 0
    };

    setCurrentLog(newLog);
  };

  const handleStop = () => {
    if (currentLog) {
      const now = Date.now();
      const finishedLog: TimeLog = {
        ...currentLog,
        endTime: now,
        duration: Math.floor((now - currentLog.startTime) / 1000)
      };
      saveLog(finishedLog);
      setLogs(prev => [finishedLog, ...prev]);
      setCurrentLog(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      
      {/* Top Navigation / Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              TB
            </div>
            <h1 className="font-bold text-xl text-gray-900 tracking-tight">Time Butler</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-gray-500 hover:text-indigo-600 transition-colors">
                <User size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Tracker View */}
        {activeTab === 'tracker' && (
          <div className="space-y-8 animate-fade-in">
            {/* Timer Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
               {currentLog ? (
                 <>
                   <div className="text-sm font-semibold uppercase tracking-widest text-indigo-500 mb-2">
                     Currently {currentLog.activityType}
                   </div>
                   <TimerDisplay startTime={currentLog.startTime} />
                   <button 
                    onClick={handleStop}
                    className="mt-6 px-6 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors"
                   >
                     Stop Tracking
                   </button>
                 </>
               ) : (
                 <div className="py-8">
                   <div className="text-gray-400 font-medium mb-2">Good Day!</div>
                   <div className="text-3xl font-bold text-gray-800">Ready to start?</div>
                 </div>
               )}
            </div>

            {/* Status Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 px-2">Log Activity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[ActivityType.WORK, ActivityType.STUDY, ActivityType.REST, ActivityType.EXERCISE, ActivityType.COMMUTE, ActivityType.SOCIAL, ActivityType.OTHER].map((type) => (
                  <StatusButton
                    key={type}
                    type={type}
                    isActive={currentLog?.activityType === type}
                    onClick={() => handleSwitchStatus(type)}
                  />
                ))}
              </div>
            </div>

            {/* AI Teaser (if logs exist) */}
            {logs.length > 0 && (
                <div className="mt-8">
                   <h2 className="text-lg font-semibold text-gray-700 mb-4 px-2">Butler's Insight</h2>
                   <AIButler logs={logs} />
                </div>
            )}
          </div>
        )}

        {/* Reports View */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-end mb-2">
                 <h2 className="text-2xl font-bold text-gray-900">Your Reports</h2>
             </div>
             <Charts logs={logs} />
             
             {/* Simple History List */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent History</h3>
                <div className="space-y-0">
                  {logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full bg-gray-400`} /> 
                         <span className="font-medium text-gray-700">{log.activityType}</span>
                      </div>
                      <div className="text-gray-500 text-sm">
                         {Math.round(log.duration / 60)} mins
                         <span className="mx-2 text-gray-300">|</span>
                         {new Date(log.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && <p className="text-gray-400 text-sm">No history yet.</p>}
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe md:hidden z-30">
        <div className="grid grid-cols-2 h-16">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'tracker' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Clock size={24} />
            <span className="text-xs font-medium">Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'reports' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <BarChart2 size={24} />
            <span className="text-xs font-medium">Reports</span>
          </button>
        </div>
      </nav>

      {/* Desktop Floating Navigation (Bottom Center) */}
      <nav className="hidden md:flex fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-full px-6 py-2 gap-8 z-30">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition-all ${
              activeTab === 'tracker' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Clock size={18} />
            Tracker
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition-all ${
              activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BarChart2 size={18} />
            Reports
          </button>
      </nav>

    </div>
  );
};

export default App;
