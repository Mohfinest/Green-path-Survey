import React from 'react';
import { Database, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentView: 'survey' | 'researcher';
  onToggleView: (view: 'survey' | 'researcher') => void;
  submissionCount: number;
  stage?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onToggleView,
  submissionCount,
  stage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#D6E4DB]/50">
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-xs tracking-wider text-[#164E33] uppercase">
          Workforce Field Study
        </span>
        <span className="text-stone-300">·</span>
        <span className="text-[11px] text-[#526A5C] hidden sm:inline">
          Nigeria RESCO Placements
        </span>
      </div>

      <div className="flex items-center gap-3">
        {currentView === 'survey' ? (
          <button
            onClick={() => onToggleView('researcher')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#164E33] bg-white hover:bg-[#F1F7F3] transition-all whitespace-nowrap border border-[#D6E4DB] shadow-2xs"
            title="View collected dataset and empirical analysis"
          >
            <Database className="w-3.5 h-3.5 text-[#E5A81E]" />
            <span>Dataset & Analytics</span>
            {submissionCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono bg-[#164E33] text-white rounded">
                {submissionCount}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => onToggleView('survey')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#164E33] hover:bg-[#103B26] transition-all whitespace-nowrap shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Survey</span>
          </button>
        )}
      </div>
    </header>
  );
};
