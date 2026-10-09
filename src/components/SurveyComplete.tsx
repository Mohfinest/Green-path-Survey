import React from 'react';
import { StoredSubmission } from '../types/survey';
import { CheckCircle2, Download, RotateCcw, Database } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../utils/storage';

interface SurveyCompleteProps {
  submission: StoredSubmission;
  onReset: () => void;
  onViewResearcher: () => void;
}

export const SurveyComplete: React.FC<SurveyCompleteProps> = ({
  submission,
  onReset,
  onViewResearcher,
}) => {
  const downloadMySubmission = () => {
    exportToJSON([submission]);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14 text-center">
      {/* Success Badge */}
      <div className="w-16 h-16 bg-[#F1F7F3] border-2 border-[#164E33] text-[#164E33] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
        <CheckCircle2 className="w-9 h-9 stroke-[2.2] text-[#164E33]" />
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E33] tracking-wider uppercase mb-2">
        <span>Field Record Secured</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5A81E]" />
        <span>Renewable Energy Workforce Study</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14291E] mb-4">
        Thank you for sharing your experience.
      </h1>

      {/* Mandatory closing statement */}
      <div className="bg-white border border-[#D6E4DB] rounded-2xl p-5 sm:p-7 text-left space-y-4 mb-6 shadow-xs">
        <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
          This research is focused on understanding what actually happens inside renewable energy operations, not testing whether people like a particular solution.
        </p>

        <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
          Your experience will help us distinguish observed problems from assumptions and identify where further research is needed.
        </p>

        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
          <span>Submission ID: <strong className="font-mono text-[#164E33] font-bold">{submission.id}</strong></span>
          <span>Recorded: {new Date(submission.submittedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <button
          onClick={downloadMySubmission}
          className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl border border-[#D6E4DB] bg-white hover:bg-[#F1F7F3] text-[#14291E] text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <Download className="w-4 h-4 text-[#164E33]" />
          <span>Download My Response (JSON)</span>
        </button>

        <button
          onClick={onViewResearcher}
          className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl bg-[#164E33] hover:bg-[#103B26] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all border-b-2 border-[#103B26]"
        >
          <Database className="w-4 h-4 text-[#E5A81E]" />
          <span>View Study Findings & Dataset</span>
        </button>
      </div>

      <div className="pt-4 border-t border-[#D6E4DB]">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-[#526A5C] hover:text-[#164E33] transition-colors py-2 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Record another field experience</span>
        </button>
      </div>
    </div>
  );
};

