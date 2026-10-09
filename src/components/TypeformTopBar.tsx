import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TypeformTopBarProps {
  currentQuestionNumber?: number;
  totalQuestions?: number;
  canGoBack: boolean;
  onBack: () => void;
  percent: number;
}

export const TypeformTopBar: React.FC<TypeformTopBarProps> = ({
  currentQuestionNumber,
  totalQuestions,
  canGoBack,
  onBack,
  percent,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <>
      {/* Refined thin progress line with forest green & solar accent */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#E8E6DF]/70">
        <div
          className="h-full bg-[#144D30] transition-all duration-300 ease-out relative"
          style={{ width: `${clampedPercent}%` }}
        >
          {/* Subtle solar-yellow accent tip at the progress leading edge */}
          {clampedPercent > 0 && clampedPercent < 100 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-[#E5A93C] shadow-[0_0_6px_rgba(229,169,60,0.8)]" />
          )}
        </div>
      </div>

      {/* Top navigation & progress status bar */}
      <header className="fixed top-[3px] left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#1C1E21] transition-colors py-1.5 px-2.5 -ml-2 rounded-lg hover:bg-stone-200/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#144D30]"
              title="Return to previous question (Up arrow)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
              <span className="font-medium">Previous</span>
            </button>
          )}
        </div>

        {/* Uncluttered progress badge */}
        {currentQuestionNumber && totalQuestions && (
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-stone-500 bg-[#EFECE6]/80 px-2.5 py-1 rounded-md border border-[#E2DFD8]">
              Question {currentQuestionNumber} of {totalQuestions}
            </span>
          </div>
        )}
      </header>
    </>
  );
};
