import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TypeformNavControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export const TypeformNavControls: React.FC<TypeformNavControlsProps> = ({
  onPrev,
  onNext,
  canPrev,
  canNext,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center bg-white border border-[#E2DFD8] shadow-sm rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-[#1C1E21] hover:bg-stone-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#144D30]"
        title="Previous question (Up arrow)"
        aria-label="Previous question"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-[#E2DFD8]" />

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-[#1C1E21] hover:bg-stone-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#144D30]"
        title="Next question (Down arrow)"
        aria-label="Next question"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
};
