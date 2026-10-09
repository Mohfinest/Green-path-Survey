import React, { useEffect, useRef } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

interface TypeformOrganisationProps {
  value: string;
  onChange: (val: string) => void;
  onContinue: () => void;
  direction?: 'forward' | 'backward';
}

export const TypeformOrganisation: React.FC<TypeformOrganisationProps> = ({
  value,
  onChange,
  onContinue,
  direction = 'forward',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onContinue();
    }
  };

  const animationClass = direction === 'backward' ? 'typeform-slide-backward' : 'typeform-slide-forward';

  return (
    <div className={`w-full max-w-2xl px-6 py-8 mx-auto text-left ${animationClass}`}>
      <div className="space-y-6 sm:space-y-7">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#144D30]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Preliminary Details</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1E21] leading-tight font-display">
            What RESCO or organisation did you complete your placement with?
          </h2>

          <p className="text-sm sm:text-base text-stone-500">
            Optional: This helps us understand whether observed patterns occur across different organisations.
          </p>
        </div>

        {/* Clean large input */}
        <div className="pt-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type organisation name (optional)..."
            className="w-full pb-3 pt-2 text-xl sm:text-2xl font-medium text-[#1C1E21] placeholder:text-stone-300 border-b-2 border-[#E2DFD8] focus:border-[#144D30] outline-none transition-colors bg-transparent"
          />
        </div>

        {/* Action button */}
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="min-h-[48px] px-8 py-3.5 rounded-xl bg-[#144D30] hover:bg-[#0E3B24] active:bg-[#092B19] text-white font-semibold text-sm sm:text-base transition-all shadow-sm active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#144D30]"
          >
            <span>{value ? 'Continue' : 'Skip'}</span>
            <ArrowRight className="w-4 h-4 text-white/90" />
          </button>

          <span className="text-xs text-stone-400 hidden sm:inline-block">
            press <strong className="font-semibold text-stone-600">Enter ↵</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
