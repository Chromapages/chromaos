'use client';

import { use, useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { doc, getDoc } from 'firebase/firestore';

// Placeholder — replace with your actual OpenClaw API key in .env.local
// NEXT_PUBLIC_OPENCLAW_API_KEY=your_key_here
const OPENCLAW_API_KEY = process.env.NEXT_PUBLIC_OPENCLAW_API_KEY ?? 'REPLACE_ME';

interface Lead {
  id: string;
  fullName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  tradeOrVertical?: string;
  source?: string;
  sourceDetail?: string;
  budgetRange?: string;
  timeline?: string;
  offerInterest?: string;
  status?: string;
  fitScore?: number;
  notesSummary?: string;
  companyId?: string;
}

interface ClassifyResult {
  fitScore?: number;
  disposition?: string;
  packageFit?: string;
  nextAction?: string;
  summary?: string;
  riskFlags?: string[];
  urgencyLevel?: string;
}

interface AnalyzeResult {
  overallScore?: number;
  categoryScores?: Record<string, number>;
  top3Issues?: string[];
  executiveDiagnosis?: string;
  recommendedPath?: string;
}

export default function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Classification state
  const [classifyLoading, setClassifyLoading] = useState(false);
  const [classifyResult, setClassifyResult] = useState<ClassifyResult | null>(null);
  const [classifyError, setClassifyError] = useState<string | null>(null);

  // Website analysis state
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  // Customer conversion state
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [convertSuccess, setConvertSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLead() {
      try {
        const docRef = doc(db, 'leads', leadId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLead({ id: docSnap.id, ...(docSnap.data() as Omit<Lead, 'id'>) });
        } else {
          setError('Lead not found');
        }
      } catch (err: any) {
        setError(err.message ?? 'Failed to load lead');
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [leadId]);

  async function handleClassify() {
    setClassifyLoading(true);
    setClassifyError(null);
    setClassifyResult(null);
    try {
      const res = await fetch('/api/agent/lead-classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': OPENCLAW_API_KEY,
        },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Classification failed');
      setClassifyResult(data.output ?? data);
    } catch (err: any) {
      setClassifyError(err.message);
    } finally {
      setClassifyLoading(false);
    }
  }

  async function handleAnalyzeWebsite() {
    setAnalyzeLoading(true);
    setAnalyzeError(null);
    setAnalyzeResult(null);
    try {
      const res = await fetch('/api/agent/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': OPENCLAW_API_KEY,
        },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed');
      setAnalyzeResult(data.output ?? data);
    } catch (err: any) {
      setAnalyzeError(err.message);
    } finally {
      setAnalyzeLoading(false);
    }
  }

  async function handleMarkAsCustomer() {
    setConvertLoading(true);
    setConvertError(null);
    setConvertSuccess(null);
    try {
      const res = await fetch(`/api/leads/${leadId}/convert-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Conversion failed');
      setConvertSuccess(`Customer folder created at: ${data.clientFolderPath}`);
      // Refresh lead data
      const docRef = doc(db, 'leads', leadId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLead({ id: docSnap.id, ...(docSnap.data() as Omit<Lead, 'id'>) });
      }
    } catch (err: any) {
      setConvertError(err.message);
    } finally {
      setConvertLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-500">Loading lead…</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-red-500">{error ?? 'Lead not found'}</p>
      </div>
    );
  }

  const dispositionColor: Record<string, string> = {
    proceed: 'text-green-600 dark:text-green-400',
    proceed_with_caution: 'text-yellow-600 dark:text-yellow-400',
    redirect: 'text-blue-600 dark:text-blue-400',
    disqualify: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen">
      {/* Header */}
      <header className="w-full bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            ← Dashboard
          </a>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <h1 className="text-lg font-semibold text-black dark:text-zinc-50">{lead.fullName ?? 'Lead Detail'}</h1>
          {lead.fitScore != null && (
            <span className="ml-auto inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Fit: {lead.fitScore}/10
            </span>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-6 py-8 max-w-4xl mx-auto w-full">
        {/* Lead Fields */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">Lead Information</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {[
              ['Company', lead.companyName, lead.companyId ? `/companies/${lead.companyId}` : null],
              ['Email', lead.email],
              ['Phone', lead.phone],
              ['Website', lead.website],
              ['Trade / Vertical', lead.tradeOrVertical],
              ['Source', lead.source, lead.sourceDetail],
              ['Budget', lead.budgetRange],
              ['Timeline', lead.timeline],
              ['Status', lead.status],
              ['Offer Interest', lead.offerInterest],
              ['Notes', lead.notesSummary],
            ].map(([label, value, sub]) => {
              if (!value && !sub) return null;
              
              const isCompanyLink = label === 'Company' && typeof sub === 'string' && sub.startsWith('/companies');

              return (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium text-zinc-400">{label}</dt>
                  <dd className="text-sm text-black dark:text-zinc-100">
                    {isCompanyLink ? (
                      <a href={sub as string} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                        {value as string}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <>
                        {value ?? '—'}
                        {typeof sub === 'string' && !sub.startsWith('/') ? <span className="text-zinc-400"> ({sub})</span> : null}
                      </>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        {/* Customer Conversion */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">Customer Status</h2>
          {lead.status === 'customer' ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Customer</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleMarkAsCustomer}
                disabled={convertLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {convertLoading ? (
                  <>
                    <LoadingSpinner />
                    Converting…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mark as Customer
                  </>
                )}
              </button>
              {convertError && <p className="text-sm text-red-600 dark:text-red-400">{convertError}</p>}
              {convertSuccess && <p className="text-sm text-green-600 dark:text-green-400">{convertSuccess}</p>}
            </div>
          )}
        </section>

        {/* AI Actions */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">AI Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleClassify}
              disabled={classifyLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
            >
              {classifyLoading ? (
                <>
                  <LoadingSpinner />
                  Classifying…
                </>
              ) : (
                'Classify Lead'
              )}
            </button>
            <button
              onClick={handleAnalyzeWebsite}
              disabled={analyzeLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              {analyzeLoading ? (
                <>
                  <LoadingSpinner />
                  Analyzing…
                </>
              ) : (
                'Analyze Website'
              )}
            </button>
          </div>

          {/* Classification Result */}
          {classifyError && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{classifyError}</p>
          )}
          {classifyResult && (
            <ResultCard title="Classification Result" colorClass={dispositionColor[classifyResult.disposition ?? '']}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <ResultField label="Fit Score" value={`${classifyResult.fitScore ?? '—'}/10`} />
                <ResultField label="Disposition" value={classifyResult.disposition ?? '—'} colorClass={dispositionColor[classifyResult.disposition ?? '']} />
                <ResultField label="Package Fit" value={classifyResult.packageFit ?? '—'} />
                <ResultField label="Urgency" value={classifyResult.urgencyLevel ?? '—'} />
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-zinc-400 mb-1">Summary</dt>
                  <dd className="text-sm text-black dark:text-zinc-100">{classifyResult.summary ?? '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-zinc-400 mb-1">Next Action</dt>
                  <dd className="text-sm text-black dark:text-zinc-100">{classifyResult.nextAction ?? '—'}</dd>
                </div>
                {classifyResult.riskFlags && classifyResult.riskFlags.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-zinc-400 mb-1">Risk Flags</dt>
                    <dd className="flex flex-wrap gap-2 mt-1">
                      {classifyResult.riskFlags.map((flag, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                          {flag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </div>
            </ResultCard>
          )}

          {/* Website Analysis Result */}
          {analyzeError && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{analyzeError}</p>
          )}
          {analyzeResult && (
            <ResultCard title="Website Analysis">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <ResultField label="Overall Score" value={`${analyzeResult.overallScore ?? '—'}/100`} />
                {analyzeResult.categoryScores && Object.keys(analyzeResult.categoryScores).length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-zinc-400 mb-2">Category Scores</dt>
                    <dd className="flex flex-col gap-2">
                      {Object.entries(analyzeResult.categoryScores).map(([cat, score]) => (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-sm text-black dark:text-zinc-100 w-36 capitalize">{cat}</span>
                          <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div
                              className="h-2 rounded-full bg-black dark:bg-zinc-100 transition-all"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500 w-10 text-right">{score}</span>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
                {analyzeResult.top3Issues && analyzeResult.top3Issues.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-zinc-400 mb-1">Top Issues</dt>
                    <dd className="flex flex-col gap-1">
                      {analyzeResult.top3Issues.map((issue, i) => (
                        <span key={i} className="text-sm text-black dark:text-zinc-100 flex gap-2">
                          <span className="text-zinc-400">{i + 1}.</span> {issue}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {analyzeResult.executiveDiagnosis && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-zinc-400 mb-1">Executive Diagnosis</dt>
                    <dd className="text-sm text-black dark:text-zinc-100">{analyzeResult.executiveDiagnosis}</dd>
                  </div>
                )}
                {analyzeResult.recommendedPath && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-zinc-400 mb-1">Recommended Path</dt>
                    <dd className="text-sm text-black dark:text-zinc-100">{analyzeResult.recommendedPath}</dd>
                  </div>
                )}
              </div>
            </ResultCard>
          )}
        </section>
      </main>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function ResultCard({ title, children, colorClass = '' }: { title: string; children: React.ReactNode; colorClass?: string }) {
  return (
    <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Result</h3>
        {colorClass && <span className={`text-xs font-medium ${colorClass}`}>{title}</span>}
      </div>
      {children}
    </div>
  );
}

function ResultField({ label, value, colorClass = '' }: { label: string; value: string; colorClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-zinc-400">{label}</dt>
      <dd className={`text-sm font-medium ${colorClass || 'text-black dark:text-zinc-100'}`}>{value}</dd>
    </div>
  );
}
