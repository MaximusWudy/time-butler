import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { TimeLog } from '../types';
import { ACTIVITY_COLORS } from '../constants';

interface ChartsProps {
  logs: TimeLog[];
}

export const Charts: React.FC<ChartsProps> = ({ logs }) => {
  
  const pieData = useMemo(() => {
    const totals: Record<string, number> = {};
    logs.forEach(log => {
      const type = log.activityType;
      totals[type] = (totals[type] || 0) + log.duration;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value: Math.round(value / 60), // minutes
        fill: ACTIVITY_COLORS[name] || '#94a3b8'
      }))
      .sort((a, b) => b.value - a.value);
  }, [logs]);

  // Aggregate by day for bar chart (last 7 days)
  const barData = useMemo(() => {
    const days: Record<string, any> = {};
    const now = new Date();
    
    // Initialize last 7 days
    for(let i=6; i>=0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString(undefined, { weekday: 'short' });
        days[dateStr] = { name: dateStr };
    }

    logs.forEach(log => {
        const d = new Date(log.startTime);
        // Only process if within last ~7 days roughly
        if ((now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000) {
            const dateStr = d.toLocaleDateString(undefined, { weekday: 'short' });
            if (days[dateStr]) {
                const hours = log.duration / 3600;
                days[dateStr][log.activityType] = (days[dateStr][log.activityType] || 0) + hours;
            }
        }
    });

    return Object.values(days);
  }, [logs]);

  if (logs.length === 0) {
      return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No logs recorded yet.</p>
          </div>
      )
  }

  return (
    <div className="space-y-8">
      {/* Overview Pie Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Breakdown (Minutes)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Stacked Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Trend (Hours)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              {/* Generate Bars dynamically based on known activity types to ensure colors match */}
              {Object.keys(ACTIVITY_COLORS).map(key => (
                  <Bar key={key} dataKey={key} stackId="a" fill={ACTIVITY_COLORS[key]} radius={[0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};