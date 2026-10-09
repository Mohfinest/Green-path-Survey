import React, { useEffect } from 'react';
import { Clock, ShieldCheck, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { SurveyAnswers } from '../types/survey';

interface SurveyIntroProps {
  answers: SurveyAnswers;
  onUpdateAnswers: (updated: Partial<SurveyAnswers>) => void;
  onStart: () => void;
  hasExistingDraft: boolean;
  onClearDraft: () => void;
}

export const SurveyIntro: React.FC<SurveyIntroProps> = ({
  answers,
  onUpdateAnswers,
  onStart,
  hasExistingDraft,
  onClearDraft,
}) => {
  // Listen for Enter key to start (signature Typeform behavior)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        // If not actively typing inside a text input
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          onStart();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center max-w-2xl mx-auto px-5 py-8 sm:py-12 animate-fadeIn">
      <div className="space-y-6">
        {/* Topic kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#164E33] uppercase tracking-wider bg-[#F1F7F3] px-3 py-1 rounded-full border border-[#D6E4DB] w-fit">
          <span className="w-2 h-2 rounded-full bg-[#E5A81E]" />
          <span>Field Workforce Research</span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#14291E] leading-tight font-display tracking-tight">
            Inside Nigeria's Renewable Energy Workforce: A 12-Month Field Experience Study
          </h1>

          <p className="text-base sm:text-lg text-[#3B4E42] font-normal leading-relaxed">
            An exploratory study of workforce, technician and operational challenges experienced during RESCO placements.
          </p>
        </div>

        {/* Time estimate */}
        <div className="flex items-center gap-2 text-xs text-[#526A5C] font-medium">
          <Clock className="w-4 h-4 text-[#E5A81E]" />
          <span>Takes ~7–10 minutes · Self-paced</span>
        </div>

        {/* Research Purpose Statement */}
        <div className="bg-white border border-[#D6E4DB] rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#164E33]">
            Purpose & Empirical Grounding
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            This study asks what practitioners and teams <strong className="text-[#164E33] font-semibold">actually did</strong> on the ground, not what hypothetical tools they would like to use. It contains no promotional or product inquiries. Its goal is to empirically examine field realities—including allowing data to <strong className="text-[#164E33] font-semibold">disprove the hypothesis</strong> that technician difficulty is an inevitable cause of recurring operational friction.
          </p>
        </div>

        {/* Response Guidance */}
        <div className="bg-[#F1F7F3] border border-[#C6DACF] rounded-2xl p-5">
          <div className="text-xs font-bold text-[#164E33] uppercase tracking-wider mb-1.5">
            Response Guidance
          </div>
          <p className="text-xs sm:text-sm text-[#14291E] leading-relaxed font-medium">
            "Please answer based on what you personally experienced or directly observed during your placement. When possible, describe a specific recent example rather than a general opinion. Please answer based primarily on your experience during the past 12 months of your RESCO placement."
          </p>
        </div>

        {/* Confidentiality Notice */}
        <div className="bg-white border border-[#D6E4DB] rounded-2xl p-5 shadow-2xs text-stone-600">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#FEF9EE] border border-[#F2D78E] text-[#C68E13] mt-0.5 shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#C68E13]" />
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-900 mb-1">
                Confidentiality Notice & Voluntary Participation
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-600">
                "Please do not share confidential, proprietary or commercially sensitive information about your RESCO, clients, projects, contracts or internal operations. This research is interested in your professional experience and general observations during your placement. You may skip any question you are not comfortable answering."
              </p>
            </div>
          </div>
        </div>

        {/* Optional Organisation / RESCO Field */}
        <div className="bg-white border border-[#D6E4DB] rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#164E33]" />
            <label htmlFor="introResco" className="text-xs font-bold uppercase tracking-wider text-stone-900">
              RESCO / Organisation <span className="text-stone-400 font-normal lowercase">(optional)</span>
            </label>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            "Optional: What RESCO or organisation did you complete your placement with? This helps us understand whether observed patterns occur across different organisations."
          </p>
          <input
            id="introResco"
            type="text"
            value={answers.rescoName || ''}
            onChange={(e) => onUpdateAnswers({ rescoName: e.target.value })}
            placeholder="e.g. Havenhill Synergy, GVE Projects, Rubitec, Nayo Tropical..."
            className="w-full mt-1 px-4 py-3 rounded-xl border border-[#D6E4DB] focus:border-[#164E33] focus:ring-2 focus:ring-[#164E33]/20 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all bg-[#FAF9F5]/40"
          />
        </div>

        {/* Typeform-style Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onStart}
            className="w-full sm:w-auto min-h-[52px] py-3.5 px-8 rounded-xl bg-[#164E33] hover:bg-[#103B26] text-white font-bold text-base shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-3 group border-b-2 border-[#103B26]"
          >
            <span>{hasExistingDraft ? 'Continue Survey' : 'Start'}</span>
            <ArrowRight className="w-4 h-4 text-[#E5A81E] group-hover:translate-x-0.5 transition-transform" />
          </button>

          <span className="text-xs text-[#526A5C] hidden sm:inline-block">
            press <strong className="font-semibold text-stone-800">Enter ↵</strong>
          </span>

          {hasExistingDraft && (
            <button
              onClick={onClearDraft}
              className="text-xs text-[#526A5C] hover:text-[#164E33] py-1.5 transition-colors underline ml-auto"
            >
              Start fresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
