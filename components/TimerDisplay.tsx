import React, { useEffect, useState } from 'react';

interface TimerDisplayProps {
  startTime: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ startTime }) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      setElapsed(Math.floor((now - startTime) / 1000));
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="font-mono text-5xl font-bold text-gray-800 tracking-wider">
      {formatTime(elapsed)}
    </div>
  );
};

export default TimerDisplay;
