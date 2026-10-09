import { SurveyAnswers, StoredSubmission } from '../types/survey';
import { SURVEY_QUESTIONS } from '../data/surveyQuestions';

const DRAFT_KEY = 'resco_survey_draft_v1';
const SUBMISSIONS_KEY = 'resco_survey_submissions_v1';

export interface DraftState {
  answers: SurveyAnswers;
  currentQuestionIndex: number;
  lastUpdated: string;
  hasStarted: boolean;
}

export function loadSurveyDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load draft:', e);
    return null;
  }
}

export function saveSurveyDraft(answers: SurveyAnswers, currentQuestionIndex: number, hasStarted: boolean): void {
  try {
    const state: DraftState = {
      answers,
      currentQuestionIndex,
      lastUpdated: new Date().toISOString(),
      hasStarted,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save draft:', e);
  }
}

export function clearSurveyDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error('Failed to clear draft:', e);
  }
}

export function getStoredSubmissions(): StoredSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      // Seed with initial realistic research responses so the researcher view has immediate value
      const sample = getInitialSampleSubmissions();
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(sample));
      return sample;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get submissions:', e);
    return [];
  }
}

export function saveNewSubmission(answers: SurveyAnswers): StoredSubmission {
  const existing = getStoredSubmissions();
  const newSubmission: StoredSubmission = {
    id: 'SUB-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    submittedAt: new Date().toISOString(),
    answers,
  };
  const updated = [newSubmission, ...existing];
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store submission:', e);
  }
  clearSurveyDraft();
  return newSubmission;
}

export function resetAllSubmissions(): void {
  try {
    localStorage.removeItem(SUBMISSIONS_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function exportToCSV(submissions: StoredSubmission[]): void {
  if (submissions.length === 0) return;

  const headers = [
    'Submission ID',
    'Date Submitted',
    'RESCO / Organisation',
    'Q1 Primary Role',
    'Q1 Role Other',
    'Q2 Time Involved',
    'Q3 Systems Worked With',
    'Q3 Systems Other',
    'Q4 Primary State',
    'Q4 State Details',
    'Q5 Struggled Finding Skilled Techs',
    'Q6 Recent Action Taken',
    'Q7 Challenges Faced',
    'Q7 Challenges Other',
    'Q8 Most Significant Challenge',
    'Q8 Significant Other',
    'Q9 Delay Frequency',
    'Q10 Main Consequence',
    'Q10 Consequence Other',
    'Q11 Time Resolving',
    'Q12 What Made It Hard To Resolve',
    'Q13 Where Team Turned First',
    'Q13 Where Turned Other',
    'Q14 What Worked Well',
    'Q15 What Did Not Work Well',
    'Q16 Did Team Change Approach',
    'Q17 What Changed & Why',
    'Q18 Observed Spending Money',
    'Q19 Paying For',
    'Q19 Paying For Other',
    'Q20 Trigger For Spending',
    'Q21 Urgency Trigger',
    'Q22 Hardest Workforce Stage',
    'Q22 Hardest Stage Other',
    'Q23 In-Depth Case Problem Narrative',
    'Q24 Remove One Problem Priority',
    'Q25 Follow-Up Open',
    'Q25 Name',
    'Q25 Contact (Email/WhatsApp)',
  ];

  const escapeCSV = (str: any) => {
    if (str === undefined || str === null) return '""';
    const val = Array.isArray(str) ? str.join('; ') : String(str);
    return `"${val.replace(/"/g, '""')}"`;
  };

  const rows = submissions.map((s) => {
    const a = s.answers || {};
    return [
      escapeCSV(s.id),
      escapeCSV(s.submittedAt),
      escapeCSV(a.rescoName),
      escapeCSV(a.q1_role),
      escapeCSV(a.q1_role_other),
      escapeCSV(a.q2_time),
      escapeCSV(a.q3_systems),
      escapeCSV(a.q3_systems_other),
      escapeCSV(a.q4_state),
      escapeCSV(a.q4_state_other),
      escapeCSV(a.q5_struggle),
      escapeCSV(a.q6_recent_action),
      escapeCSV(a.q7_challenges),
      escapeCSV(a.q7_challenges_other),
      escapeCSV(a.q8_significant),
      escapeCSV(a.q8_significant_other),
      escapeCSV(a.q9_delay_freq),
      escapeCSV(a.q10_consequence),
      escapeCSV(a.q10_consequence_other),
      escapeCSV(a.q11_time_resolving),
      escapeCSV(a.q12_hard_to_resolve),
      escapeCSV(a.q13_where_turned),
      escapeCSV(a.q13_where_turned_other),
      escapeCSV(a.q14_worked_well),
      escapeCSV(a.q15_not_worked_well),
      escapeCSV(a.q16_changed_approach),
      escapeCSV(a.q17_what_changed),
      escapeCSV(a.q18_observed_spending),
      escapeCSV(a.q19_paying_for),
      escapeCSV(a.q19_paying_for_other),
      escapeCSV(a.q20_spending_trigger),
      escapeCSV(a.q21_urgent_trigger),
      escapeCSV(a.q22_hardest_stage),
      escapeCSV(a.q22_hardest_stage_other),
      escapeCSV(a.q23_deep_case_study),
      escapeCSV(a.q24_remove_one_problem),
      escapeCSV(a.q25_followup_chat),
      escapeCSV(a.q25_name),
      escapeCSV(a.q25_contact),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `resco_workforce_field_study_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(submissions: StoredSubmission[]): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(submissions, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `resco_workforce_study_dataset_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function getInitialSampleSubmissions(): StoredSubmission[] {
  return [
    {
      id: 'SUB-NG8814',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      answers: {
        rescoName: 'GVE Projects Ltd',
        q1_role: 'Operations & Maintenance (O&M)',
        q2_time: '9 – 12 months',
        q3_systems: ['Mini-grids (isolated / interconnected)', 'Solar + Storage (BESS)'],
        q4_state: 'Niger',
        q5_struggle: 'Yes',
        q6_recent_action: 'We had an inverter communication fault in an off-grid community in Niger State. Local electrician could not interpret Modbus RS-485 error codes, so lead technical engineer was flown from Abuja to Minna and then spent 4 hours on motorcycle to reach the site.',
        q7_challenges: [
          'Verifying technician technical competence / skills',
          'Remote deployment & site logistics',
          'Monitoring work quality while offsite',
          'Communication and responsiveness from the field'
        ],
        q8_significant: 'Verifying technician technical competence / skills',
        q9_delay_freq: '4 to 6 times',
        q10_consequence: 'Unplanned emergency travel to site',
        q11_time_resolving: '11 – 20 hours',
        q12_hard_to_resolve: 'No local diagnostic tools. The remote technician claimed the battery BMS was damaged when it was simply a loose communication cable pin termination.',
        q13_where_turned: ['Internal in-house staff', 'Technician network', 'Referrals'],
        q14_worked_well: 'Internal staff already knew the firmware and wiring diagram of the system.',
        q15_not_worked_well: 'Internal staff were already fully occupied with commissioning in another geopolitical zone, creating project backlog.',
        q16_changed_approach: 'Yes',
        q17_what_changed: 'Created standardized color-coded check sheets with photographic WhatsApp checklists before any technician can declare a site inspection complete.',
        q18_observed_spending: 'Yes',
        q19_paying_for: ['Emergency travel, flights, and field per-diem', 'External specialist contractors / field consultants'],
        q20_spending_trigger: 'Customer complaints escalating to local traditional ruler, threatening community relations.',
        q21_urgent_trigger: 'Extended outage of primary clinic power supply backed by the mini-grid.',
        q22_hardest_stage: 'Verifying technical skills & credentials',
        q23_deep_case_study: 'During a 60kWp mini-grid battery bank expansion, the hired local contractor reversed DC polarity on one of the string isolators. The internal circuit breaker tripped, preventing fire, but destroyed the surge protective device. We had to pause installation, send our O&M supervisor from head office, source a replacement SPD from Lagos with 3 days transit time, and manually test every termination.',
        q24_remove_one_problem: 'Lack of practical hands-on verification before hiring technicians for remote locations.',
        q25_followup_chat: 'Yes',
        q25_name: 'Engr. Ibrahim O.',
        q25_contact: 'ibrahim.o@sample-resco.ng / +234 803 000 1234',
      },
    },
    {
      id: 'SUB-NG4291',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      answers: {
        rescoName: 'Havenhill Synergy',
        q1_role: 'Site / Project Operations',
        q2_time: 'More than 12 months (> 12 months)',
        q3_systems: ['Mini-grids (isolated / interconnected)', 'Commercial & Industrial (C&I)'],
        q4_state: 'Oyo',
        q5_struggle: 'Yes',
        q6_recent_action: 'We hired two local vocational school graduates for metering deployments. Required 3 full days of shadow training by our senior supervisor before they could install smart meters safely without meter-tamper lockouts.',
        q7_challenges: [
          'Upskilling or training for specific equipment',
          'Field reporting and documentation',
          'Retention / technicians leaving after training'
        ],
        q8_significant: 'Retention / technicians leaving after training',
        q9_delay_freq: '2 to 3 times',
        q10_consequence: 'Need for immediate on-site retraining',
        q11_time_resolving: '5 – 10 hours',
        q12_hard_to_resolve: 'Language barrier with local technicians and high turnover once they received certified training on three-phase installations.',
        q13_where_turned: ['Vocational training institutions / academies', 'Local community members / site-adjacent hires'],
        q14_worked_well: 'Community hires stayed resident on site and helped resolve minor grid line faults quickly.',
        q15_not_worked_well: 'Formal theoretical training institutions did not provide hands-on experience with modern bi-directional inverters or PLC smart meters.',
        q16_changed_approach: 'Yes',
        q17_what_changed: 'Instituted a retention incentive and contracted local technical liaisons on milestone retainers.',
        q18_observed_spending: 'Yes',
        q19_paying_for: ['Specialized training courses / workshops', 'Temporary field relief staff'],
        q20_spending_trigger: 'High failure rate during meter verification audits by the regulator.',
        q21_urgent_trigger: 'Milestone compliance audit deadline under the Nigeria Electrification Project (NEP).',
        q22_hardest_stage: 'Retaining trained talent long-term',
        q23_deep_case_study: 'During community line reticulation, three trained wiremen left for an urban building construction contractor who offered higher daily cash wages. The mini-grid energization was held up for three weeks while we trained another batch of local youth.',
        q24_remove_one_problem: 'Technician turnover and wage poaching immediately after investment in field safety and equipment training.',
        q25_followup_chat: 'No',
      }
    }
  ];
}
