import React from 'react';
import { Loader2, AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

interface TypeformSubmittingProps {
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onGoBack: () => void;
}

export const TypeformSubmitting: React.FC<TypeformSubmittingProps> = ({
  isLoading,
  errorMessage,
  onRetry,
  onGoBack,
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl px-6 py-12 mx-auto text-left typeform-slide-forward">
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#144D30]/10 border border-[#144D30]/20 flex items-center justify-center text-[#144D30]">
            <Loader2 className="w-7 h-7 animate-spin text-[#144D30]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1E21] font-display">
              Submitting your response...
            </h2>
            <p className="text-sm sm:text-base text-stone-500">
              Recording your field observations to the research database. Please wait a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full max-w-2xl px-6 py-12 mx-auto text-left typeform-slide-forward">
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1E21] font-display">
              Submission could not be completed
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              We were unable to record your survey to the backend server. Your answers are safely preserved.
            </p>
            <div className="p-3.5 bg-stone-100 rounded-xl text-xs font-mono text-stone-700 border border-stone-200">
              {errorMessage}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="min-h-[48px] px-8 py-3.5 rounded-xl bg-[#144D30] hover:bg-[#0E3B24] active:bg-[#092B19] text-white font-semibold text-sm sm:text-base transition-all shadow-sm active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#144D30]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={onGoBack}
              className="min-h-[48px] px-6 py-3.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Review answers</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
