import React, { useState, useEffect, useRef, useMemo } from 'react';
import { QuestionDefinition, SurveyAnswers } from '../types/survey';
import { NIGERIAN_STATES } from '../data/nigerianStates';
import { Check, ArrowRight, Search, HelpCircle } from 'lucide-react';

interface TypeformQuestionProps {
  question: QuestionDefinition;
  answers: SurveyAnswers;
  onUpdateAnswer: (key: string, value: any) => void;
  onNext: () => void;
  direction?: 'forward' | 'backward';
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const TypeformQuestion: React.FC<TypeformQuestionProps> = ({
  question,
  answers,
  onUpdateAnswer,
  onNext,
  direction = 'forward',
}) => {
  const currentValue = answers[question.id];
  const otherKey = `${question.id}_other`;
  const otherValue = answers[otherKey] || '';

  const [stateSearch, setStateSearch] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  // Focus input automatically on open text questions
  useEffect(() => {
    if (question.type === 'textarea') {
      textInputRef.current?.focus();
    }
  }, [question.id, question.type]);

  const handleSingleSelect = (optionId: string, isOther?: boolean) => {
    onUpdateAnswer(question.id, optionId);
    if (!isOther && optionId !== 'other') {
      // Auto-advance with subtle 240ms delay for smooth feedback
      setTimeout(() => {
        onNext();
      }, 240);
    }
  };

  const handleMultiSelect = (optionId: string) => {
    const list: string[] = Array.isArray(currentValue) ? [...currentValue] : [];
    const idx = list.indexOf(optionId);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(optionId);
    }
    onUpdateAnswer(question.id, list);
  };

  const isSelected = (optId: string) => {
    if (question.type === 'multi') {
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

  // Keyboard navigation (Letters A-L and Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputFocused = activeTag === 'textarea' || activeTag === 'input';

      // Enter key to advance (unless Shift+Enter in textarea)
      if (e.key === 'Enter') {
        if (question.type === 'textarea') {
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onNext();
          }
        } else if (!isInputFocused || activeTag === 'input') {
          e.preventDefault();
          onNext();
        }
        return;
      }

      // Keyboard letters A-L for choices when not typing in text field
      if (!isInputFocused && question.options && question.options.length > 0) {
        const key = e.key.toUpperCase();
        const letterIndex = LETTERS.indexOf(key);
        if (letterIndex > -1 && letterIndex < question.options.length) {
          e.preventDefault();
          const target = question.options[letterIndex];
          if (question.type === 'single') {
            handleSingleSelect(target.id, target.isOther);
          } else if (question.type === 'multi') {
            handleMultiSelect(target.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, currentValue, onNext]);

  // Filtered Nigerian states
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return NIGERIAN_STATES;
    const q = stateSearch.toLowerCase();
    return NIGERIAN_STATES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q)
    );
  }, [stateSearch]);

  const animationClass = direction === 'backward' ? 'typeform-slide-backward' : 'typeform-slide-forward';

  return (
    <div className={`w-full max-w-2xl px-6 py-6 sm:py-8 mx-auto text-left ${animationClass}`}>
      <div className="space-y-6 sm:space-y-7">
        {/* Question Header */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#144D30]">
            <span>{question.section}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1E21] leading-tight font-display">
            {question.title}
          </h2>

          {question.subtitle && (
            <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
              {question.subtitle}
            </p>
          )}

          {/* Helper text (e.g. Q23 case study guidance) */}
          {question.clarification && (
            <div className="p-4 bg-white rounded-xl border border-[#E2DFD8] text-xs sm:text-sm text-stone-600 font-medium flex items-start gap-3 shadow-xs">
              <HelpCircle className="w-4 h-4 text-[#144D30] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{question.clarification}</span>
            </div>
          )}
        </div>

        {/* Input Elements */}
        <div className="space-y-3">
          {/* SINGLE CHOICE */}
          {question.type === 'single' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((opt, idx) => {
                const active = isSelected(opt.id);
                const letter = LETTERS[idx] || (idx + 1);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSingleSelect(opt.id, opt.isOther)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 min-h-[54px] active:scale-[0.99] cursor-pointer group ${
                      active
                        ? 'bg-[#144D30]/6 border-[#144D30] text-[#1C1E21] font-semibold ring-1 ring-[#144D30] shadow-xs'
                        : 'bg-white border-[#E2DFD8] text-stone-800 hover:border-[#144D30]/60 hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-md font-mono text-xs font-semibold flex items-center justify-center shrink-0 transition-colors ${
                          active
                            ? 'bg-[#144D30] text-white'
                            : 'bg-[#F2EFE9] text-stone-600 group-hover:bg-[#E5E2DC]'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm sm:text-base leading-snug">
                        {opt.label}
                      </span>
                    </div>

                    {active && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] shrink-0 shadow-[0_0_4px_rgba(229,169,60,0.8)]" />
                    )}
                  </button>
                );
              })}

              {/* If "Other" selected */}
              {question.hasOther && hasSelectedOther() && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={otherValue}
                    onChange={(e) => onUpdateAnswer(otherKey, e.target.value)}
                    placeholder={question.otherPlaceholder || 'Please specify...'}
                    autoFocus
                    className="w-full pb-3 pt-2 text-base sm:text-lg font-medium text-[#1C1E21] placeholder:text-stone-300 border-b-2 border-[#E2DFD8] focus:border-[#144D30] outline-none transition-colors bg-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {/* MULTIPLE CHOICE */}
          {question.type === 'multi' && question.options && (
            <div className="space-y-2.5">
              <span className="text-xs text-stone-400 font-medium block">
                Select all that apply:
              </span>
              {question.options.map((opt, idx) => {
                const active = isSelected(opt.id);
                const letter = LETTERS[idx] || (idx + 1);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleMultiSelect(opt.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 min-h-[54px] active:scale-[0.99] cursor-pointer group ${
                      active
                        ? 'bg-[#144D30]/6 border-[#144D30] text-[#1C1E21] font-semibold ring-1 ring-[#144D30] shadow-xs'
                        : 'bg-white border-[#E2DFD8] text-stone-800 hover:border-[#144D30]/60 hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-md font-mono text-xs font-semibold flex items-center justify-center shrink-0 transition-colors ${
                          active
                            ? 'bg-[#144D30] text-white'
                            : 'bg-[#F2EFE9] text-stone-600 group-hover:bg-[#E5E2DC]'
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
                        active
                          ? 'border-[#144D30] bg-[#144D30] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })}

              {/* If "Other" selected */}
              {question.hasOther && hasSelectedOther() && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={otherValue}
                    onChange={(e) => onUpdateAnswer(otherKey, e.target.value)}
                    placeholder={question.otherPlaceholder || 'Please specify...'}
                    autoFocus
                    className="w-full pb-3 pt-2 text-base sm:text-lg font-medium text-[#1C1E21] placeholder:text-stone-300 border-b-2 border-[#E2DFD8] focus:border-[#144D30] outline-none transition-colors bg-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {/* OPEN TEXT / TEXTAREA */}
          {question.type === 'textarea' && (
            <div className="space-y-3">
              <textarea
                ref={textInputRef as any}
                rows={question.rows || (question.id === 'q23_deep_case_study' ? 7 : 4)}
                value={currentValue || ''}
                onChange={(e) => onUpdateAnswer(question.id, e.target.value)}
                placeholder={question.placeholder || 'Type your direct field observation here...'}
                className="w-full p-4 text-base sm:text-lg font-normal text-[#1C1E21] placeholder:text-stone-400 border-2 border-[#E2DFD8] rounded-xl focus:border-[#144D30] outline-none transition-colors bg-white leading-relaxed resize-y shadow-xs"
              />
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Shift ⇧ + Enter ↵ for newline</span>
                <span>Cmd/Ctrl ⌘ + Enter ↵ to continue</span>
              </div>
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
                  placeholder="Type to filter states (e.g. Lagos, Niger, Kano, Abuja)..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#E2DFD8] text-sm sm:text-base text-[#1C1E21] focus:border-[#144D30] focus:ring-1 focus:ring-[#144D30] outline-none bg-white shadow-xs"
                />
              </div>

              {currentValue && (
                <div className="flex items-center justify-between p-3.5 bg-[#144D30]/8 border border-[#144D30]/20 rounded-xl text-sm font-semibold text-[#1C1E21]">
                  <span>Selected: <strong>{currentValue} State</strong></span>
                  <button
                    type="button"
                    onClick={() => onUpdateAnswer(question.id, '')}
                    className="text-xs text-[#144D30] underline hover:text-[#0E3B24] cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="max-h-56 overflow-y-auto border border-[#E2DFD8] rounded-xl bg-white divide-y divide-stone-100 p-1">
                {filteredStates.map((st) => {
                  const active = currentValue === st.name;
                  return (
                    <button
                      key={st.name}
                      type="button"
                      onClick={() => onUpdateAnswer(question.id, st.name)}
                      className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between min-h-[44px] hover:bg-stone-50 rounded-lg transition-colors cursor-pointer ${
                        active ? 'bg-[#144D30]/8 font-semibold text-[#1C1E21]' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{st.name}</span>
                        <span className="text-xs text-stone-400">({st.zone})</span>
                      </div>
                      {active && <Check className="w-4 h-4 text-[#144D30]" />}
                    </button>
                  );
                })}
              </div>

              {/* Optional multi-state field */}
              <div className="pt-2">
                <input
                  type="text"
                  value={answers.q4_state_other || ''}
                  onChange={(e) => onUpdateAnswer('q4_state_other', e.target.value)}
                  placeholder="Operated across multiple states? (Optional note)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E2DFD8] bg-transparent text-[#1C1E21] focus:border-[#144D30] outline-none"
                />
              </div>
            </div>
          )}

          {/* Q25 FOLLOW-UP CONTACT DETAILS */}
          {question.id === 'q25_followup_chat' && currentValue === 'Yes' && (
            <div className="space-y-4 pt-3 p-4 bg-white rounded-xl border border-[#E2DFD8]">
              <p className="text-xs font-semibold text-[#144D30] uppercase tracking-wider">
                Follow-up Contact Information (Optional)
              </p>

              <div>
                <input
                  type="text"
                  value={answers.q25_name || ''}
                  onChange={(e) => onUpdateAnswer('q25_name', e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="w-full pb-2.5 pt-1 text-base text-[#1C1E21] placeholder:text-stone-300 border-b border-[#E2DFD8] focus:border-[#144D30] outline-none bg-transparent"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={answers.q25_contact || ''}
                  onChange={(e) => onUpdateAnswer('q25_contact', e.target.value)}
                  placeholder="Email or WhatsApp Number"
                  className="w-full pb-2.5 pt-1 text-base text-[#1C1E21] placeholder:text-stone-300 border-b border-[#E2DFD8] focus:border-[#144D30] outline-none bg-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onNext}
            className="min-h-[48px] px-8 py-3.5 rounded-xl bg-[#144D30] hover:bg-[#0E3B24] active:bg-[#092B19] text-white font-semibold text-sm sm:text-base transition-all shadow-sm active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#144D30]"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 text-white/90" />
          </button>

          <span className="text-xs text-stone-400 hidden sm:inline-block">
            press <strong className="font-semibold text-stone-600">Enter ↵</strong>
          </span>

          <button
            type="button"
            onClick={onNext}
            className="ml-auto text-xs text-stone-400 hover:text-stone-600 font-medium py-2 px-3 transition-colors cursor-pointer"
          >
            Skip question
          </button>
        </div>
      </div>
    </div>
  );
};
