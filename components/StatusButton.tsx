import React from 'react';
import { Briefcase, BookOpen, Coffee, Car, Dumbbell, Users, HelpCircle, LucideIcon } from 'lucide-react';
import { ActivityType } from '../types';
import { ACTIVITY_COLORS } from '../constants';

interface StatusButtonProps {
  type: string;
  isActive: boolean;
  onClick: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  [ActivityType.WORK]: Briefcase,
  [ActivityType.STUDY]: BookOpen,
  [ActivityType.REST]: Coffee,
  [ActivityType.COMMUTE]: Car,
  [ActivityType.EXERCISE]: Dumbbell,
  [ActivityType.SOCIAL]: Users,
  [ActivityType.OTHER]: HelpCircle
};

const StatusButton: React.FC<StatusButtonProps> = ({ type, isActive, onClick }) => {
  const Icon = ICON_MAP[type] || HelpCircle;
  const color = ACTIVITY_COLORS[type] || ACTIVITY_COLORS[ActivityType.OTHER];

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 transform
        ${isActive 
          ? 'scale-105 shadow-xl ring-4 ring-offset-2' 
          : 'hover:scale-105 hover:shadow-md bg-white border border-gray-100'
        }
      `}
      style={{
        backgroundColor: isActive ? color : 'white',
        borderColor: isActive ? color : undefined,
        ['--tw-ring-color' as any]: color
      }}
    >
      <Icon 
        size={32} 
        className={`mb-2 ${isActive ? 'text-white' : 'text-gray-600'}`} 
      />
      <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
        {type}
      </span>
      
      {isActive && (
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      )}
    </button>
  );
};

export default StatusButton;
