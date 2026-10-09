import { SurveyAnswers } from '../types/survey';
import { GOOGLE_APPS_SCRIPT_URL } from '../config';

export interface StructuredSurveySubmission {
  id: string;
  submittedAt: string;
  rescoName: string;
  answers: Record<string, any>;
  metadata: {
    userAgent: string;
    screenResolution: string;
    language: string;
    timezone: string;
  };
}

export interface SubmissionResult {
  success: boolean;
  message?: string;
  submissionId?: string;
}

/**
 * Builds a clean, fully structured JavaScript object representing
 * the complete survey response with all branching and optional fields.
 */
export function buildSubmissionPayload(answers: SurveyAnswers): StructuredSurveySubmission {
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const id = `RESP-${Date.now()}-${randomSuffix}`;

  return {
    id,
    submittedAt: timestamp,
    rescoName: answers.rescoName || '',
    answers: { ...answers },
    metadata: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    },
  };
}

/**
 * Submits the survey payload using a native HTML form POST targeting a hidden iframe.
 *
 * This completely bypasses JavaScript fetch/CORS restrictions, preflight checks, and
 * cross-origin redirect blocking. Delivery is verified via the iframe's onload event
 * with a safety timeout.
 */
export function submitToGoogleAppsScript(
  payload: StructuredSurveySubmission
): Promise<SubmissionResult> {
  return new Promise((resolve, reject) => {
    const endpoint = GOOGLE_APPS_SCRIPT_URL.trim();

    // 1. Console log: endpoint (no answer exposure)
    console.log('SUBMISSION: endpoint', endpoint);

    if (!endpoint) {
      const errorMsg = 'Google Apps Script URL is not configured. Please set GOOGLE_APPS_SCRIPT_URL in src/config.ts or VITE_GOOGLE_APPS_SCRIPT_URL in your environment.';
      console.error('SUBMISSION ERROR:', errorMsg);
      return reject(new Error(errorMsg));
    }

    // 2. Console log: payload ID (no answer exposure)
    console.log('SUBMISSION: payload ID', payload.id);

    if (typeof document === 'undefined') {
      return reject(new Error('Native form submission is only supported in browser environments.'));
    }

    const uniqueId = `gapps_target_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const iframeName = `iframe_${uniqueId}`;

    let isCompleted = false;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

    // Cleanup helper for DOM elements
    const cleanup = () => {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
        timeoutTimer = null;
      }
      setTimeout(() => {
        try {
          if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
          if (form && form.parentNode) form.parentNode.removeChild(form);
        } catch {
          // Ignore DOM cleanup exceptions
        }
      }, 500);
    };

    // 1. Create hidden target iframe
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.id = iframeName;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';

    // When the iframe finishes navigating/loading, delivery is considered initiated
    iframe.onload = () => {
      if (isCompleted) return;
      isCompleted = true;
      cleanup();
      resolve({
        success: true,
        submissionId: payload.id,
        message: 'Survey delivery initiated successfully via native form submission.',
      });
    };

    iframe.onerror = () => {
      if (isCompleted) return;
      isCompleted = true;
      cleanup();
      reject(new Error('The target iframe encountered an error while attempting native form submission.'));
    };

    document.body.appendChild(iframe);

    // 2. Create hidden HTML form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = endpoint;
    form.target = iframeName;
    form.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'payload';
    input.value = JSON.stringify(payload);
    form.appendChild(input);

    document.body.appendChild(form);

    // 3. Set a timeout-based error state if the form submission cannot be considered delivered after a reasonable period
    const SUBMISSION_TIMEOUT_MS = 14000;
    timeoutTimer = setTimeout(() => {
      if (isCompleted) return;
      isCompleted = true;
      cleanup();
      reject(new Error(`Submission timed out after ${SUBMISSION_TIMEOUT_MS / 1000}s. The server may be unreachable or experiencing severe delays. Please retry.`));
    }, SUBMISSION_TIMEOUT_MS);

    try {
      // Unmistakable submission marker logs
      console.log('NATIVE_FORM_SUBMISSION_V2');
      console.log('SUBMISSION: native form submitted');

      // Submit native form targeting hidden iframe
      form.submit();

      console.log('NATIVE_FORM_SUBMITTED_V2');
    } catch (submitError: any) {
      if (isCompleted) return;
      isCompleted = true;
      cleanup();
      console.error('SUBMISSION ERROR: Failed to execute native form.submit():', submitError);
      reject(new Error(`Failed to initiate native form submission: ${submitError?.message || submitError}`));
    }
  });
}
