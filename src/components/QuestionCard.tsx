import React, { useState, useMemo, useEffect, useRef } from 'react';
import { QuestionDefinition, SurveyAnswers } from '../types/survey';
import { NIGERIAN_STATES } from '../data/nigerianStates';
import { Check, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Search, ArrowRight, CornerDownLeft } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionDefinition;
  questionIndex: number;
  totalQuestions: number;
  answers: SurveyAnswers;
  onUpdateAnswer: (key: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  answers,
  onUpdateAnswer,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}) => {
  const [stateSearch, setStateSearch] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const currentValue = answers[question.id];

  // Helper for "Other" field key
  const otherKey = `${question.id}_other`;
  const otherValue = answers[otherKey] || '';

  // Filtered Nigerian states
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return NIGERIAN_STATES;
    const q = stateSearch.toLowerCase();
    return NIGERIAN_STATES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q)
    );
  }, [stateSearch]);

  const handleSingleSelect = (optionId: string, isOther?: boolean) => {
    onUpdateAnswer(question.id, optionId);
    // If not "other", auto-advance with Typeform signature quick delay
    if (!isOther && optionId !== 'other') {
      setTimeout(() => {
        onNext();
      }, 260);
    }
  };

  const handleMultiSelect = (optionId: string) => {
    const list: string[] = Array.isArray(currentValue) ? [...currentValue] : [];
    const index = list.indexOf(optionId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(optionId);
    }
    onUpdateAnswer(question.id, list);
  };

  const isOptionSelected = (optId: string, isMulti: boolean) => {
    if (isMulti) {
      return Array.isArray(currentValue) && currentValue.includes(optId);
    }
    return currentValue === optId;
  };

  const hasSelectedOther = () => {
    if (question.type === 'multi') {
      return Array.isArray(currentValue) && currentValue.includes('other');
    }
    return currentValue === 'other';
  };

  // Keyboard shortcut listener for Typeform feel (A, B, C, D... or Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a textarea or text input
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputFocused = activeTag === 'textarea' || activeTag === 'input';

      // Enter key to advance (if not in textarea where Enter creates newline)
      if (e.key === 'Enter' && !e.shiftKey) {
        if (!isInputFocused || (activeTag === 'input' && question.type !== 'textarea')) {
          e.preventDefault();
          onNext();
          return;
        }
      }

      // Letter keys A, B, C, D... for options (when not typing in a text field)
      if (!isInputFocused && question.options && question.options.length > 0) {
        const key = e.key.toUpperCase();
        const letterIndex = OPTION_LETTERS.indexOf(key);
        if (letterIndex > -1 && letterIndex < question.options.length) {
          e.preventDefault();
          const targetOpt = question.options[letterIndex];
          if (question.type === 'single') {
            handleSingleSelect(targetOpt.id, targetOpt.isOther);
          } else if (question.type === 'multi') {
            handleMultiSelect(targetOpt.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, currentValue, onNext]);

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center max-w-2xl mx-auto px-5 py-6 sm:py-10 animate-fadeIn">
      {/* Typeform Question Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#164E33]">
          <span className="font-mono text-sm tracking-tight flex items-center gap-1">
            {question.number} <ArrowRight className="w-3.5 h-3.5 text-[#E5A81E]" />
          </span>
          <span className="text-[#526A5C] uppercase tracking-wider text-[11px]">
            {question.section}
          </span>
        </div>

        <h2 className="text-xl sm:text-3xl font-extrabold text-[#14291E] leading-snug font-display">
          {question.title}
        </h2>

        {question.subtitle && (
          <p className="text-sm sm:text-base text-[#4E6356] leading-relaxed font-normal">
            {question.subtitle}
          </p>
        )}

        {question.clarification && (
          <p className="text-xs text-[#526A5C] bg-[#F1F7F3] p-3 rounded-xl border border-[#D6E4DB]">
            {question.clarification}
          </p>
        )}
      </div>

      {/* Inputs / Choice List */}
      <div className="space-y-2.5 mb-8">
        {/* SINGLE CHOICE */}
        {question.type === 'single' && question.options && (
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const selected = isOptionSelected(opt.id, false);
              const letter = OPTION_LETTERS[idx] || (idx + 1);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSingleSelect(opt.id, opt.isOther)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 min-h-[54px] active:scale-[0.99] group ${
                    selected
                      ? 'bg-[#F1F7F3] border-[#164E33] text-[#14291E] font-semibold ring-1 ring-[#164E33]'
                      : 'bg-white border-[#D6E4DB] text-stone-800 hover:border-[#164E33]/50 hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        selected
                          ? 'bg-[#164E33] text-[#E5A81E]'
                          : 'bg-[#FAF9F5] border border-[#D6E4DB] text-stone-600 group-hover:border-[#164E33]'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base leading-snug">
                      {opt.label}
                    </span>
                  </div>

                  {selected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E5A81E] shrink-0" />
                  )}
                </button>
              );
            })}

            {/* Other text input */}
            {question.hasOther && hasSelectedOther() && (
              <div className="mt-3 p-4 bg-white rounded-xl border border-[#164E33] shadow-xs animate-fadeIn">
                <label className="block text-xs font-bold text-[#164E33] mb-1.5">
                  Please specify your "Other" answer:
                </label>
                <input
                  type="text"
                  value={otherValue}
                  onChange={(e) => onUpdateAnswer(otherKey, e.target.value)}
                  placeholder={question.otherPlaceholder || 'Type your answer...'}
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6E4DB] text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#164E33]"
                />
              </div>
            )}
          </div>
        )}

        {/* MULTIPLE CHOICE */}
        {question.type === 'multi' && question.options && (
          <div className="space-y-2">
            <p className="text-xs text-[#526A5C] mb-1 font-medium">
              Choose as many as you like:
            </p>
            {question.options.map((opt, idx) => {
              const selected = isOptionSelected(opt.id, true);
              const letter = OPTION_LETTERS[idx] || (idx + 1);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleMultiSelect(opt.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 min-h-[54px] active:scale-[0.99] group ${
                    selected
                      ? 'bg-[#F1F7F3] border-[#164E33] text-[#14291E] font-semibold ring-1 ring-[#164E33]'
                      : 'bg-white border-[#D6E4DB] text-stone-800 hover:border-[#164E33]/50 hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        selected
                          ? 'bg-[#164E33] text-[#E5A81E]'
                          : 'bg-[#FAF9F5] border border-[#D6E4DB] text-stone-600 group-hover:border-[#164E33]'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base leading-snug">
                      {opt.label}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      selected
                        ? 'border-[#164E33] bg-[#164E33] text-white'
                        : 'border-[#D6E4DB] bg-white'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-[#E5A81E] stroke-[3]" />}
                  </div>
                </button>
              );
            })}

            {/* Other text input */}
            {question.hasOther && hasSelectedOther() && (
              <div className="mt-3 p-4 bg-white rounded-xl border border-[#164E33] shadow-xs animate-fadeIn">
                <label className="block text-xs font-bold text-[#164E33] mb-1.5">
                  Please specify your "Other" option:
                </label>
                <input
                  type="text"
                  value={otherValue}
                  onChange={(e) => onUpdateAnswer(otherKey, e.target.value)}
                  placeholder={question.otherPlaceholder || 'Specify details...'}
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6E4DB] text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#164E33]"
                />
              </div>
            )}
          </div>
        )}

        {/* NIGERIAN STATE SELECTOR */}
        {question.type === 'state-select' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder="Type state name (e.g. Lagos, Niger, Kano, FCT)..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#D6E4DB] bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#164E33]"
              />
            </div>

            {currentValue && (
              <div className="flex items-center justify-between p-3.5 bg-[#F1F7F3] border border-[#C6DACF] rounded-xl text-sm text-[#14291E] font-medium">
                <span>Selected: <strong className="text-[#164E33]">{currentValue} State</strong></span>
                <button
                  type="button"
                  onClick={() => onUpdateAnswer(question.id, '')}
                  className="text-xs text-[#164E33] underline hover:text-[#103B26] font-bold"
                >
                  Change
                </button>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto border border-[#D6E4DB] rounded-xl bg-white divide-y divide-stone-100 p-1">
              {filteredStates.map((st) => {
                const isSelected = currentValue === st.name;
                return (
                  <button
                    key={st.name}
                    type="button"
                    onClick={() => {
                      onUpdateAnswer(question.id, st.name);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between min-h-[44px] hover:bg-[#F1F7F3] rounded-lg transition-colors ${
                      isSelected ? 'bg-[#F1F7F3] text-[#164E33] font-bold' : 'text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{st.name}</span>
                      <span className="text-[11px] text-[#526A5C]">({st.zone})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#164E33]" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs text-[#526A5C] mb-1">
                Operated across multiple states or regional headquarters? (Optional note)
              </label>
              <input
                type="text"
                value={answers.q4_state_other || ''}
                onChange={(e) => onUpdateAnswer('q4_state_other', e.target.value)}
                placeholder="e.g. Niger, Kaduna & FCT Abuja sites"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D6E4DB] bg-white focus:outline-none focus:ring-1 focus:ring-[#164E33]"
              />
            </div>
          </div>
        )}

        {/* OPEN TEXT / TEXTAREA */}
        {question.type === 'textarea' && (
          <div className="space-y-3">
            <textarea
              ref={textInputRef as any}
              rows={question.rows || 4}
              value={currentValue || ''}
              onChange={(e) => onUpdateAnswer(question.id, e.target.value)}
              placeholder={question.placeholder || 'Type your direct field observation...'}
              autoFocus
              className="w-full p-4 rounded-2xl border-2 border-[#D6E4DB] bg-white text-stone-900 text-base sm:text-lg focus:outline-none focus:border-[#164E33] focus:ring-4 focus:ring-[#164E33]/10 transition-all leading-relaxed placeholder:text-stone-400"
            />
            <div className="flex justify-between items-center text-xs text-[#526A5C]">
              <span>Ground-level details provide the most useful evidence</span>
              <span>Shift ⇧ + Enter ↵ to make a line break</span>
            </div>
          </div>
        )}

        {/* Q25 FOLLOW-UP CONTACTS */}
        {question.id === 'q25_followup_chat' && currentValue === 'Yes' && (
          <div className="mt-4 p-5 bg-white border border-[#D6E4DB] rounded-2xl space-y-3 shadow-xs animate-fadeIn">
            <p className="text-xs text-[#14291E] font-bold">
              Optional follow-up details:
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#164E33] mb-1">
                Your Name <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={answers.q25_name || ''}
                onChange={(e) => onUpdateAnswer('q25_name', e.target.value)}
                placeholder="e.g. Babatunde / Chidinma"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D6E4DB] focus:outline-none focus:ring-2 focus:ring-[#164E33]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#164E33] mb-1">
                Email or WhatsApp Number
              </label>
              <input
                type="text"
                value={answers.q25_contact || ''}
                onChange={(e) => onUpdateAnswer('q25_contact', e.target.value)}
                placeholder="e.g. name@resco.ng or +234 803 123 4567"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D6E4DB] focus:outline-none focus:ring-2 focus:ring-[#164E33]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Typeform Primary Action & Keyboard Hint */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onNext}
          className="min-h-[48px] py-3 px-7 rounded-xl bg-[#164E33] hover:bg-[#103B26] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all border-b-2 border-[#103B26]"
        >
          <span>{isLast ? 'Review' : 'OK'}</span>
          <Check className="w-4 h-4 text-[#E5A81E] stroke-[3]" />
        </button>

        <span className="text-xs text-[#526A5C] hidden sm:inline-flex items-center gap-1">
          press <strong className="font-semibold text-stone-800">Enter ↵</strong>
        </span>

        <button
          type="button"
          onClick={onSkip}
          className="ml-auto text-xs text-[#526A5C] hover:text-[#164E33] font-medium py-2 px-3 hover:bg-[#F1F7F3] rounded-lg transition-colors"
          title="Skip this voluntary question"
        >
          Skip question
        </button>
      </div>

      {/* Typeform-style Bottom Right Up/Down Chevrons Navigation */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D6E4DB] shadow-md">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-600 hover:text-[#164E33] hover:bg-[#F1F7F3] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Previous question"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-600 hover:text-[#164E33] hover:bg-[#F1F7F3] transition-all"
          title="Next question"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <span className="px-2 text-xs font-mono font-bold text-[#164E33]">
          {questionIndex + 1}/{totalQuestions}
        </span>
      </div>
    </div>
  );
};
