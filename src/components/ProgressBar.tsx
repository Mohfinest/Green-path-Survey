import React from 'react';

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  sectionName: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
}) => {
  const percent = Math.min(100, Math.round(((currentIndex) / totalQuestions) * 100));

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#D6E4DB]/40">
      <div
        className="h-full bg-gradient-to-r from-[#164E33] to-[#E5A81E] transition-all duration-300 ease-out"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};
