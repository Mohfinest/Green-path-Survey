import React, { useState, useMemo } from 'react';
import { StoredSubmission } from '../types/survey';
import { exportToCSV, exportToJSON, resetAllSubmissions } from '../utils/storage';
import {
  Download,
  Filter,
  BarChart3,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ResearcherDashboardProps {
  submissions: StoredSubmission[];
  onBackToSurvey: () => void;
  onRefreshData: () => void;
}

export const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({
  submissions,
  onBackToSurvey,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'table' | 'narratives'>('metrics');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [struggleFilter, setStruggleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<StoredSubmission | null>(null);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const a = s.answers || {};
      if (roleFilter !== 'ALL' && a.q1_role !== roleFilter) return false;
      if (stateFilter !== 'ALL' && a.q4_state !== stateFilter) return false;
      if (struggleFilter !== 'ALL' && a.q5_struggle !== struggleFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const textToSearch = [
          s.id,
          a.rescoName,
          a.q4_state,
          a.q6_recent_action,
          a.q12_hard_to_resolve,
          a.q23_deep_case_study,
          a.q24_remove_one_problem,
        ].filter(Boolean).join(' ').toLowerCase();

        if (!textToSearch.includes(q)) return false;
      }

      return true;
    });
  }, [submissions, roleFilter, stateFilter, struggleFilter, searchTerm]);

  // Key Aggregations for empirical analysis
  const metrics = useMemo(() => {
    const total = submissions.length;
    if (total === 0) return null;

    let struggleYes = 0;
    let struggleNo = 0;
    let struggleNotSure = 0;

    let spentMoneyYes = 0;
    let spentMoneyNo = 0;

    const challengeCounts: Record<string, number> = {};
    const consequenceCounts: Record<string, number> = {};
    const delayFreqCounts: Record<string, number> = {};
    const resolutionTimeCounts: Record<string, number> = {};

    submissions.forEach((s) => {
      const a = s.answers || {};
      if (a.q5_struggle === 'Yes') struggleYes++;
      else if (a.q5_struggle === 'No') struggleNo++;
      else struggleNotSure++;

      if (a.q18_observed_spending === 'Yes') spentMoneyYes++;
      else if (a.q18_observed_spending === 'No') spentMoneyNo++;

      if (a.q8_significant) {
        challengeCounts[a.q8_significant] = (challengeCounts[a.q8_significant] || 0) + 1;
      }
      if (a.q10_consequence) {
        consequenceCounts[a.q10_consequence] = (consequenceCounts[a.q10_consequence] || 0) + 1;
      }
      if (a.q9_delay_freq) {
        delayFreqCounts[a.q9_delay_freq] = (delayFreqCounts[a.q9_delay_freq] || 0) + 1;
      }
      if (a.q11_time_resolving) {
        resolutionTimeCounts[a.q11_time_resolving] = (resolutionTimeCounts[a.q11_time_resolving] || 0) + 1;
      }
    });

    const strugglePct = Math.round((struggleYes / total) * 100);
    const spentMoneyPct = Math.round((spentMoneyYes / total) * 100);

    return {
      total,
      struggleYes,
      struggleNo,
      struggleNotSure,
      strugglePct,
      spentMoneyPct,
      challengeCounts,
      consequenceCounts,
      delayFreqCounts,
      resolutionTimeCounts,
    };
  }, [submissions]);

  // Unique lists for filters
  const uniqueRoles = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => s.answers?.q1_role && set.add(s.answers.q1_role));
    return Array.from(set);
  }, [submissions]);

  const uniqueStates = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => s.answers?.q4_state && set.add(s.answers.q4_state));
    return Array.from(set);
  }, [submissions]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#D6E4DB]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#164E33] mb-1">
            <span>Research Dataset & Analytics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A81E]" />
            <span>12-Month Field Study</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14291E]">
            Workforce Field Observations
          </h1>
          <p className="text-xs sm:text-sm text-[#526A5C] mt-0.5">
            Empirical evidence collected from active RESCO personnel across Nigerian renewable energy projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(submissions)}
            disabled={submissions.length === 0}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-[#164E33] hover:bg-[#103B26] disabled:bg-stone-300 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border-b-2 border-[#103B26]"
            title="Download CSV for Excel, Stata, R or Python"
          >
            <Download className="w-3.5 h-3.5 text-[#E5A81E]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportToJSON(submissions)}
            disabled={submissions.length === 0}
            className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#D6E4DB] bg-white hover:bg-[#F1F7F3] text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Download raw JSON dataset"
          >
            <span>JSON</span>
          </button>

          <button
            onClick={onBackToSurvey}
            className="min-h-[42px] px-4 py-2 rounded-xl border border-[#D6E4DB] bg-white hover:bg-[#F1F7F3] text-[#164E33] text-xs font-bold"
          >
            Survey Mode
          </button>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-1 p-1 bg-[#E7EFEA] rounded-xl mb-6 max-w-md border border-[#D6E4DB]">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 min-h-[38px] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'metrics'
              ? 'bg-white text-[#164E33] shadow-xs'
              : 'text-[#526A5C] hover:text-[#164E33]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#E5A81E]" />
          <span>Empirical Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`flex-1 min-h-[38px] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'table'
              ? 'bg-white text-[#164E33] shadow-xs'
              : 'text-[#526A5C] hover:text-[#164E33]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#E5A81E]" />
          <span>Responses ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('narratives')}
          className={`flex-1 min-h-[38px] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'narratives'
              ? 'bg-white text-[#164E33] shadow-xs'
              : 'text-[#526A5C] hover:text-[#164E33]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E5A81E]" />
          <span>Case Narratives</span>
        </button>
      </div>

      {/* METRICS VIEW */}
      {activeTab === 'metrics' && metrics && (
        <div className="space-y-6">
          {/* Top High-Level Proof Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 bg-white border border-[#D6E4DB] rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-[#526A5C] uppercase tracking-wider block mb-1">
                Total Submissions
              </span>
              <div className="text-3xl font-extrabold text-[#14291E] font-mono tabular-nums">
                {metrics.total}
              </div>
              <p className="text-xs text-[#526A5C] mt-1">
                Verified RESCO placement respondents
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white border border-[#D6E4DB] rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#526A5C] uppercase tracking-wider">
                  Technician Struggle Rate
                </span>
                <span className="text-xs font-bold text-[#164E33]">Q5 Hypothesis</span>
              </div>
              <div className="text-3xl font-extrabold text-[#14291E] font-mono tabular-nums">
                {metrics.strugglePct}%
              </div>
              <p className="text-xs text-[#526A5C] mt-1">
                {metrics.struggleYes} Yes · {metrics.struggleNo} No · {metrics.struggleNotSure} Not sure
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white border border-[#D6E4DB] rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-[#526A5C] uppercase tracking-wider block mb-1">
                Allocated Direct Capital
              </span>
              <div className="text-3xl font-extrabold text-[#14291E] font-mono tabular-nums">
                {metrics.spentMoneyPct}%
              </div>
              <p className="text-xs text-[#526A5C] mt-1">
                Observed spending money on workforce fixes (Q18)
              </p>
            </div>
          </div>

          {/* Hypothesis Disproving Section */}
          <div className="p-4 sm:p-5 bg-[#F1F7F3] border border-[#C6DACF] rounded-xl text-xs sm:text-sm text-[#14291E] leading-relaxed">
            <strong className="text-[#164E33] font-bold block mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E5A81E]" />
              Empirical Hypothesis Testing Note:
            </strong>
            This survey allows verifying whether skilled technician scarcity is an acute daily bottleneck or if operational friction stems from other structural factors (e.g. logistics, firmware tooling, compensation, or client delays). With {metrics.struggleNo} respondent(s) reporting "No struggle", the data accommodates diverse operational realities.
          </div>

          {/* Recurring Challenges breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-white border border-[#D6E4DB] rounded-xl shadow-xs">
              <h3 className="text-sm font-bold text-[#14291E] mb-3">
                Most Significant Recurring Challenges (Q8)
              </h3>
              {Object.keys(metrics.challengeCounts).length === 0 ? (
                <div className="text-xs text-stone-400 py-4">No challenge data yet</div>
              ) : (
                <div className="space-y-2.5">
                  {Object.entries(metrics.challengeCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count]) => {
                      const pct = Math.round((count / metrics.total) * 100);
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-800 font-medium capitalize truncate max-w-[240px]">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className="font-mono text-stone-500 tabular-nums">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-[#EAF2ED] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#164E33] h-full rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Delay frequency & Consequences */}
            <div className="p-5 bg-white border border-[#D6E4DB] rounded-xl shadow-xs">
              <h3 className="text-sm font-bold text-[#14291E] mb-3">
                Delay Frequency During Placement (Q9)
              </h3>
              {Object.keys(metrics.delayFreqCounts).length === 0 ? (
                <div className="text-xs text-stone-400 py-4">No frequency data yet</div>
              ) : (
                <div className="space-y-2.5">
                  {Object.entries(metrics.delayFreqCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count]) => {
                      const pct = Math.round((count / metrics.total) * 100);
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-800 font-medium">{key}</span>
                            <span className="font-mono text-stone-500 tabular-nums">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-[#FEF9EE] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#E5A81E] h-full rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-3.5 rounded-xl border border-[#D6E4DB]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by RESCO, state, text notes..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-[#D6E4DB] bg-[#FAF9F5]/40 focus:outline-none focus:ring-1 focus:ring-[#164E33]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <select
                value={struggleFilter}
                onChange={(e) => setStruggleFilter(e.target.value)}
                className="text-xs py-2 px-2.5 rounded-lg border border-[#D6E4DB] bg-white text-stone-800"
              >
                <option value="ALL">All Struggles</option>
                <option value="Yes">Struggled (Yes)</option>
                <option value="No">No Struggle (No)</option>
              </select>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="text-xs py-2 px-2.5 rounded-lg border border-[#D6E4DB] bg-white text-stone-800"
              >
                <option value="ALL">All States</option>
                {uniqueStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submissions List */}
          <div className="bg-white border border-[#D6E4DB] rounded-xl overflow-hidden divide-y divide-stone-100">
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No submissions matched your filter criteria.
              </div>
            ) : (
              filteredSubmissions.map((s) => {
                const a = s.answers || {};
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSubmission(s)}
                    className="p-4 hover:bg-[#F1F7F3]/50 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#164E33]">
                          {s.id}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs font-bold text-stone-900">
                          {a.rescoName || 'Anonymous RESCO'}
                        </span>
                        {a.q4_state && (
                          <span className="text-[11px] text-[#526A5C]">
                            ({a.q4_state} State)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {a.q6_recent_action || a.q23_deep_case_study || a.q12_hard_to_resolve || 'No open text comments provided.'}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#526A5C]">
                      <span>Role: <strong className="text-stone-800">{a.q1_role || 'Not specified'}</strong></span>
                      <span>·</span>
                      <span>Struggled: <strong className={a.q5_struggle === 'Yes' ? 'text-[#C68E13] font-bold' : 'text-stone-700'}>{a.q5_struggle || '—'}</strong></span>
                      <span>·</span>
                      <span>Spent Money: <strong className="text-stone-700">{a.q18_observed_spending || '—'}</strong></span>
                      {a.q25_contact && (
                        <>
                          <span>·</span>
                          <span className="text-[#164E33] font-bold">Follow-up Contact Available</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* NARRATIVES VIEW (Direct Field Quotes & Qualitative Evidence) */}
      {activeTab === 'narratives' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
            <strong>Qualitative Case Evidence:</strong> Direct verbatim accounts of workforce friction, team actions taken, what worked well, what did not, and priority interventions.
          </div>

          <div className="space-y-4">
            {submissions.map((s) => {
              const a = s.answers || {};
              const hasNarrative = a.q6_recent_action || a.q23_deep_case_study || a.q24_remove_one_problem;
              if (!hasNarrative) return null;

              return (
                <div key={s.id} className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-800">{s.id}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs font-semibold text-emerald-900">{a.rescoName || 'Anonymous RESCO'}</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs text-stone-500">{a.q4_state} State</span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(s.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {a.q23_deep_case_study && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        Q23 In-Depth Case Narrative:
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/60 font-sans">
                        "{a.q23_deep_case_study}"
                      </p>
                    </div>
                  )}

                  {a.q6_recent_action && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        Q6 What the team actually did:
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {a.q6_recent_action}
                      </p>
                    </div>
                  )}

                  {a.q24_remove_one_problem && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                        Q24 One Recurring Problem to Remove:
                      </div>
                      <p className="text-xs text-stone-700 italic">
                        "{a.q24_remove_one_problem}"
                      </p>
                    </div>
                  )}

                  {a.q25_contact && (
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>Follow-up Contact: <strong className="text-stone-800">{a.q25_name ? `${a.q25_name} (${a.q25_contact})` : a.q25_contact}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SINGLE SUBMISSION DETAIL MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-stone-800">
                  {selectedSubmission.id}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-0.5">
                  {selectedSubmission.answers.rescoName || 'Anonymous RESCO'} Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm divide-y divide-stone-100">
              {Object.entries(selectedSubmission.answers).map(([key, val]) => {
                if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) return null;
                return (
                  <div key={key} className="pt-2.5">
                    <span className="font-mono text-[11px] text-stone-400 block uppercase">
                      {key}
                    </span>
                    <span className="text-stone-800 font-medium leading-relaxed block mt-0.5">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
