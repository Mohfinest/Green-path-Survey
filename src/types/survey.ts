export type QuestionType = 'single' | 'multi' | 'text' | 'textarea' | 'state-select';

export interface QuestionOption {
  id: string;
  label: string;
  isOther?: boolean;
}

export interface QuestionDefinition {
  id: string;
  number: number | string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: QuestionOption[];
  hasOther?: boolean;
  otherPlaceholder?: string;
  placeholder?: string;
  rows?: number;
  condition?: (answers: SurveyAnswers) => boolean;
  dependsOn?: string;
  section: string;
  clarification?: string;
}

export interface SurveyAnswers {
  rescoName?: string;
  q1_role?: string;
  q1_role_other?: string;
  q2_time?: string;
  q3_systems?: string[];
  q3_systems_other?: string;
  q4_state?: string;
  q4_state_other?: string;
  q5_struggle?: 'Yes' | 'No' | 'Not sure' | '';
  q6_recent_action?: string;
  q7_challenges?: string[];
  q7_challenges_other?: string;
  q8_significant?: string;
  q8_significant_other?: string;
  q9_delay_freq?: string;
  q10_consequence?: string;
  q10_consequence_other?: string;
  q11_time_resolving?: string;
  q12_hard_to_resolve?: string;
  q13_where_turned?: string[];
  q13_where_turned_other?: string;
  q14_worked_well?: string;
  q15_not_worked_well?: string;
  q16_changed_approach?: 'Yes' | 'No' | 'Not sure' | '';
  q17_what_changed?: string;
  q18_observed_spending?: 'Yes' | 'No' | 'Not sure' | '';
  q19_paying_for?: string[];
  q19_paying_for_other?: string;
  q20_spending_trigger?: string;
  q21_urgent_trigger?: string;
  q22_hardest_stage?: string;
  q22_hardest_stage_other?: string;
  q23_deep_case_study?: string;
  q24_remove_one_problem?: string;
  q25_followup_chat?: 'Yes' | 'No' | '';
  q25_name?: string;
  q25_contact?: string; // email or WhatsApp
  [key: string]: any;
}

export interface StoredSubmission {
  id: string;
  submittedAt: string;
  answers: SurveyAnswers;
  durationMinutes?: number;
}
