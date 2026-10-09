import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SURVEY_QUESTIONS } from './data/surveyQuestions';
import { SurveyAnswers, QuestionDefinition } from './types/survey';
import {
  loadSurveyDraft,
  saveSurveyDraft,
  clearSurveyDraft,
} from './utils/storage';
import {
  buildSubmissionPayload,
  submitToGoogleAppsScript,
} from './services/submissionService';
import { TypeformTopBar } from './components/TypeformTopBar';
import { TypeformWelcome } from './components/TypeformWelcome';
import { TypeformNotice } from './components/TypeformNotice';
import { TypeformOrganisation } from './components/TypeformOrganisation';
import { TypeformQuestion } from './components/TypeformQuestion';
import { TypeformComplete } from './components/TypeformComplete';
import { TypeformSubmitting } from './components/TypeformSubmitting';
import { TypeformNavControls } from './components/TypeformNavControls';

// Step enumeration:
// -3: Welcome Screen
// -2: Confidentiality Notice
// -1: RESCO Organisation (Optional)
// 0..N-1: Active Survey Questions
// N: Submission & Completion Screen
type StepIndex = number;

export default function App() {
  const [step, setStep] = useState<StepIndex>(-3);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Transition lock to prevent duplicate clicks / skipping
  const isTransitioningRef = useRef(false);

  // Backend submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] = useState(false);

  // Load temporary draft for in-progress session recovery
  useEffect(() => {
    const draft = loadSurveyDraft();
    if (draft && draft.hasStarted && draft.answers) {
      setAnswers(draft.answers);
      setHasSavedDraft(true);
    }
  }, []);

  // Compute active questions dynamically based on branching conditions
  const activeQuestions = useMemo(() => {
    return SURVEY_QUESTIONS.filter((q) => {
      if (!q.condition) return true;
      return q.condition(answers);
    });
  }, [answers]);

  // Update a single answer and persist temporary draft
  const handleUpdateAnswer = useCallback((key: string, value: any) => {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      saveSurveyDraft(next, Math.max(0, step), true);
      return next;
    });
  }, [step]);

  // Submits the complete response object to the Google Apps Script endpoint
  const handleFinalSubmit = useCallback(async () => {
    // Prevent double submission
    if (isSubmitting || hasSubmittedSuccessfully) return;

    setIsSubmitting(true);
    setSubmissionError(null);
    setStep(activeQuestions.length);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // 1. Structure every response into a single clean JavaScript object
      const payload = buildSubmissionPayload(answers);

      // 2. HTTP POST JSON to Google Apps Script endpoint
      await submitToGoogleAppsScript(payload);

      // 3. Mark success and wipe temporary in-progress draft
      setHasSubmittedSuccessfully(true);
      clearSurveyDraft();
    } catch (err: any) {
      // 4. On failure, preserve all respondent answers intact
      console.error('Submission failed:', err);
      setSubmissionError(
        err?.message || 'The server could not process the submission. Please verify your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, activeQuestions.length, isSubmitting, hasSubmittedSuccessfully]);

  // Advance to next step smoothly with rapid-click prevention
  const handleNext = useCallback(() => {
    if (isTransitioningRef.current || isSubmitting) return;
    isTransitioningRef.current = true;
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 260);

    setDirection('forward');
    if (step < activeQuestions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      saveSurveyDraft(answers, Math.max(0, nextStep), true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Reached the final question -> Trigger backend submission
      handleFinalSubmit();
    }
  }, [step, activeQuestions.length, answers, isSubmitting, handleFinalSubmit]);

  // Step back smoothly
  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current || isSubmitting || hasSubmittedSuccessfully) return;
    if (step > -3) {
      isTransitioningRef.current = true;
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 260);

      setDirection('backward');
      setSubmissionError(null);
      const prevStep = step - 1;
      setStep(prevStep);
      saveSurveyDraft(answers, Math.max(0, prevStep), true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step, answers, isSubmitting, hasSubmittedSuccessfully]);

  // Start from welcome screen
  const handleStart = () => {
    setDirection('forward');
    setStep(-2); // Go to confidentiality notice
  };

  // Keyboard navigation for Up/Down arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'textarea' || activeTag === 'input';

      if (!isInput) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (step < activeQuestions.length - 1) {
            handleNext();
          } else if (step === activeQuestions.length - 1) {
            handleFinalSubmit();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (step > -3) handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, activeQuestions.length, handleNext, handlePrev, handleFinalSubmit]);

  // Progress computations
  const totalSteps = activeQuestions.length;
  const currentQNum = step >= 0 && step < totalSteps ? step + 1 : undefined;
  const progressPercent = step < 0 ? 0 : step >= totalSteps ? 100 : Math.round(((step + 1) / totalSteps) * 100);

  const canGoBack = step > -3 && step < totalSteps && !isSubmitting && !hasSubmittedSuccessfully;
  const isQuestionScreen = step >= 0 && step < totalSteps;
  const currentQuestion = isQuestionScreen ? activeQuestions[step] : null;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1C1E21] flex flex-col justify-between selection:bg-[#144D30]/15 selection:text-[#144D30]">
      {/* Subtle top progress bar & back indicator (questions & notice screens) */}
      {step > -3 && (
        <TypeformTopBar
          currentQuestionNumber={currentQNum}
          totalQuestions={totalSteps}
          canGoBack={canGoBack}
          onBack={handlePrev}
          percent={progressPercent}
        />
      )}

      {/* Main One-Question-at-a-Time Viewport Container */}
      <main className="flex-1 flex flex-col justify-center items-center py-12 sm:py-16">
        {step === -3 && (
          <TypeformWelcome
            onStart={handleStart}
            hasSavedDraft={hasSavedDraft}
          />
        )}

        {step === -2 && (
          <TypeformNotice
            onContinue={handleNext}
            direction={direction}
          />
        )}

        {step === -1 && (
          <TypeformOrganisation
            value={answers.rescoName || ''}
            onChange={(val) => handleUpdateAnswer('rescoName', val)}
            onContinue={handleNext}
            direction={direction}
          />
        )}

        {isQuestionScreen && currentQuestion && (
          <TypeformQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            answers={answers}
            onUpdateAnswer={handleUpdateAnswer}
            onNext={handleNext}
            direction={direction}
          />
        )}

        {/* Submission Processing & Result States */}
        {step >= totalSteps && (
          <>
            {isSubmitting || submissionError ? (
              <TypeformSubmitting
                isLoading={isSubmitting}
                errorMessage={submissionError}
                onRetry={handleFinalSubmit}
                onGoBack={() => {
                  setStep(activeQuestions.length - 1);
                  setSubmissionError(null);
                }}
              />
            ) : (
              <TypeformComplete />
            )}
          </>
        )}
      </main>

      {/* Typeform bottom-right up/down chevron buttons */}
      {step >= -2 && step < totalSteps && !isSubmitting && (
        <TypeformNavControls
          onPrev={handlePrev}
          onNext={handleNext}
          canPrev={canGoBack}
          canNext={true}
        />
      )}

      {/* Single Clean Academic Disclaimer */}
      {step > -3 && (
        <footer className="py-4 px-6 text-center text-xs text-stone-400 select-none">
          Strictly Academic & Operational Research · Anonymous & Confidential
        </footer>
      )}
    </div>
  );
}
