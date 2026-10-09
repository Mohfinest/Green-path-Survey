import React, { useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface TypeformNoticeProps {
  onContinue: () => void;
  direction?: 'forward' | 'backward';
}

export const TypeformNotice: React.FC<TypeformNoticeProps> = ({
  onContinue,
  direction = 'forward',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  const animationClass = direction === 'backward' ? 'typeform-slide-backward' : 'typeform-slide-forward';

  return (
    <div className={`w-full max-w-2xl px-6 py-8 mx-auto text-left ${animationClass}`}>
      <div className="space-y-6 sm:space-y-7">
        {/* Subtle label */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#144D30]">
          <ShieldCheck className="w-4 h-4 text-[#144D30]" />
          <span>Confidentiality & Voluntary Notice</span>
        </div>

        {/* Notice Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E6E3DC] shadow-xs">
          <blockquote className="text-lg sm:text-xl font-medium text-[#1C1E21] leading-relaxed">
            “Please do not share confidential, proprietary or commercially sensitive information about your RESCO, clients, projects, contracts or internal operations. This research is interested in your professional experience and general observations during your placement. You may skip any question you are not comfortable answering.”
          </blockquote>
        </div>

        {/* Action */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="min-h-[48px] px-8 py-3.5 rounded-xl bg-[#144D30] hover:bg-[#0E3B24] active:bg-[#092B19] text-white font-semibold text-sm sm:text-base transition-all shadow-sm active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#144D30]"
          >
            <span>I understand</span>
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
