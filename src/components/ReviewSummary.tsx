import React from 'react';
import { SurveyAnswers, QuestionDefinition } from '../types/survey';
import { SURVEY_QUESTIONS } from '../data/surveyQuestions';
import { CheckCircle2, AlertCircle, Edit3, ArrowRight, ChevronLeft } from 'lucide-react';

interface ReviewSummaryProps {
  answers: SurveyAnswers;
  activeQuestions: QuestionDefinition[];
  onJumpToQuestion: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  answers,
  activeQuestions,
  onJumpToQuestion,
  onBack,
  onSubmit,
  isSubmitting = false,
}) => {
  const getDisplayAnswer = (q: QuestionDefinition) => {
    const val = answers[q.id];
    const otherVal = answers[`${q.id}_other`];

    if (!val || (Array.isArray(val) && val.length === 0)) {
      return <span className="text-stone-400 italic">Skipped</span>;
    }

    if (Array.isArray(val)) {
      const labels = val.map((v) => {
        if (v === 'other' && otherVal) return `Other: ${otherVal}`;
        const found = q.options?.find((o) => o.id === v);
        return found ? found.label : v;
      });
      return <span className="text-stone-800">{labels.join('; ')}</span>;
    }

    if (val === 'other' && otherVal) {
      return <span className="text-stone-800">Other: {otherVal}</span>;
    }

    const found = q.options?.find((o) => o.id === val);
    return <span className="text-stone-800">{found ? found.label : String(val)}</span>;
  };

  const answeredCount = activeQuestions.filter((q) => {
    const val = answers[q.id];
    return val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0);
  }).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E33] mb-1">
          <span>Final Review</span>
          <span className="text-stone-300">·</span>
          <span>Field Study Submission</span>
        </div>
        <h2 className="text-2xl font-bold text-[#14291E]">
          Review Your Experience Record
        </h2>
        <p className="mt-1 text-sm text-[#4E6356]">
          Review your answers below. You can tap on any question to revise it before final submission.
        </p>

        <div className="mt-4 p-3.5 bg-[#F1F7F3] border border-[#C6DACF] rounded-xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#14291E] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#164E33]" />
            <span>{answeredCount} of {activeQuestions.length} questions completed</span>
          </div>
          <span className="text-[#526A5C] text-xs font-semibold">
            {activeQuestions.length - answeredCount} skipped (voluntary)
          </span>
        </div>
      </div>

      {/* Answer List */}
      <div className="space-y-3 mb-8">
        {answers.rescoName && (
          <div className="p-3.5 rounded-xl border border-[#D6E4DB] bg-white">
            <div className="text-xs font-semibold text-[#526A5C] mb-1">
              RESCO / Organisation
            </div>
            <div className="text-sm font-bold text-[#164E33]">
              {answers.rescoName}
            </div>
          </div>
        )}

        {activeQuestions.map((q, idx) => {
          const isAnswered = answers[q.id] && (!(Array.isArray(answers[q.id])) || answers[q.id].length > 0);

          return (
            <div
              key={q.id}
              onClick={() => onJumpToQuestion(idx)}
              className="p-3.5 sm:p-4 rounded-xl border border-[#D6E4DB] bg-white hover:border-[#164E33]/40 hover:bg-[#F9FCFA] cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#526A5C] mb-1">
                    <span className="font-mono font-bold text-[#164E33]">Q{q.number}</span>
                    <span>·</span>
                    <span className="truncate">{q.section}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 mb-1.5">
                    {q.title}
                  </div>
                  <div className="text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {getDisplayAnswer(q)}
                  </div>
                </div>

                <button
                  type="button"
                  className="p-1.5 rounded-lg text-stone-400 group-hover:text-[#164E33] transition-colors shrink-0"
                  title="Edit answer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-0 bg-[#FAF9F5]/95 backdrop-blur-md pt-3 pb-6 border-t border-[#D6E4DB]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[48px] px-4 rounded-xl border border-[#D6E4DB] bg-white text-stone-700 hover:bg-[#F1F7F3] font-medium text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-stone-500" />
            <span>Back to Questions</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-[#164E33] hover:bg-[#103B26] disabled:bg-[#164E33]/60 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all border-b-2 border-[#103B26]"
          >
            <span>{isSubmitting ? 'Recording Submission...' : 'Submit Field Experience'}</span>
            <ArrowRight className="w-4 h-4 text-[#E5A81E]" />
          </button>
        </div>
      </div>
    </div>
  );
};
