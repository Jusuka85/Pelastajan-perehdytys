import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="bg-accent h-full transition-all duration-500 ease-out flex items-center justify-center text-[10px] text-white font-bold"
          style={{ width: `${percentage}%` }}
        >
          {percentage >= 10 && `${percentage}%`}
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500 min-w-[3.5rem] text-right">
        {current} / {total}
      </span>
    </div>
  );
};