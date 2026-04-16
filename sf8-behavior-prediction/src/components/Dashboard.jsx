import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clipboard, SendHorizontal, X } from "lucide-react";
import { fetchAnalysis, fetchCustomers, sendCopilotMessage } from "../services/api.js";

const QUICK_PROMPTS = [
  "Customer is challenging the interest rate",
  "Provide a quantified trust argument",
  "Suggest a compliant next-action script",
];

const RISK_STYLES = {
  Low: { width: "35%", color: "bg-emerald-500", label: "Low" },
  Medium: { width: "65%", color: "bg-amber-500", label: "Medium" },
  High: { width: "90%", color: "bg-rose-500", label: "High" },
};

const SOURCE_BADGE = {
  e_wallet: "bg-sky-50 text-sky-700 border-sky-200",
  social_media: "bg-violet-50 text-violet-700 border-violet-200",
  telco: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const LAYER_LABELS = {
  L0_METHOD: "Method Validation",
  L0_INPUT: "Input Validation",
  L1_CUSTOMER_LOOKUP: "Customer Lookup",
  L2_MESSAGE_VALIDATION: "Message Validation",
  L2_PRODUCT_SCOPE: "Scope Resolution",
  L3_QWEN_ANALYZE: "Qwen Analysis",
  L4_QWEN_COPILOT: "Qwen Copilot",
};

function flattenTags(behavioralTags) {
  const rows = [];
  for (const source of ["e_wallet", "social_media", "telco"]) {
    for (const tag of behavioralTags[source] || []) {
      rows.push({ source, tag });
    }
  }
  return rows;
}

function toTrustScore(customer) {
  const base = customer.risk_score === "Low" ? 72 : customer.risk_score === "Medium" ? 58 : 43;
  return Math.min(100, base + customer.lookalike_rate);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatLatency(value) {
  if (!Number.isFinite(value) || value < 0) return "n/a";
  if (value < 1000) return `${Math.round(value)} ms`;
  return `${(value / 1000).toFixed(2)} s`;
}

function formatTimestamp(value) {
  if (!value) return "n/a";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "n/a";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function trimLongText(text, maxLength = 220) {
  const value = String(text || "").trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function buildAnalysisBrief(analysis) {
  if (!analysis) return "";
  const rationale = safeArray(analysis.behavioral_rationale).slice(0, 2).join(" | ") || "No rationale returned";
  const evidence = safeArray(analysis.statistical_evidence).slice(0, 2).join(" | ") || "No quantitative evidence returned";

  return [
    "Analysis package is now available in Copilot context.",
    `Recommended product: ${analysis.recommended_product || "n/a"}`,
    `Sales script: ${trimLongText(analysis.sales_pitch_script, 180)}`,
    `Behavioral rationale: ${rationale}`,
    `Quantitative evidence: ${evidence}`,
  ].join("\n");
}

function buildKpiCards(customers) {
  if (!customers.length) {
    return [
      { label: "Total Qualified Customers", value: 0 },
      { label: "Priority Outreach", value: 0 },
      { label: "Standard Nurture", value: 0 },
      { label: "Average Trust Score", value: 0 },
    ];
  }

  const priorityCount = customers.filter((item) => item.risk_score === "Low").length;
  const nurtureCount = customers.filter((item) => item.risk_score !== "Low").length;
  const avgTrust = Math.round(
    customers.reduce((sum, item) => sum + toTrustScore(item), 0) / customers.length
  );

  return [
    { label: "Total Qualified Customers", value: customers.length },
    { label: "Priority Outreach", value: priorityCount },
    { label: "Standard Nurture", value: nurtureCount },
    { label: "Average Trust Score", value: avgTrust },
  ];
}

function normalizeFlowMeta(meta = {}, fallbackLatency = null) {
  return {
    traceId: meta.trace_id || "n/a",
    updatedAt: meta.response_at || new Date().toISOString(),
    latencyMs: Number.isFinite(meta.latency_ms) ? meta.latency_ms : fallbackLatency,
    model: meta.model || "qwen3.6-plus",
    regionEndpoint: meta.region_endpoint || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    scope: meta.scope || null,
    layers: safeArray(meta.layers),
  };
}

function layerText(layerId) {
  return LAYER_LABELS[layerId] || layerId;
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [copied, setCopied] = useState(false);

  const [chatByCustomer, setChatByCustomer] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [flowByCustomer, setFlowByCustomer] = useState({});

  useEffect(() => {
    let mounted = true;

    fetchCustomers()
      .then((rows) => {
        if (!mounted) return;
        setCustomers(rows);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const heroCustomer = useMemo(() => {
    if (!customers.length) return null;
    return customers.reduce((best, current) =>
      toTrustScore(current) > toTrustScore(best) ? current : best
    );
  }, [customers]);

  const kpiCards = useMemo(() => buildKpiCards(customers), [customers]);

  const currentCustomerId = selectedCustomer?.customer_id || "";
  const currentChat = currentCustomerId ? chatByCustomer[currentCustomerId] || [] : [];
  const currentFlow = currentCustomerId ? flowByCustomer[currentCustomerId] || {} : {};
  const analyzeFlow = currentFlow.analyze || null;
  const copilotFlow = currentFlow.copilot || null;
  const activeScope = analyzeFlow?.scope || copilotFlow?.scope || null;
  const layerRows = [...safeArray(analyzeFlow?.layers), ...safeArray(copilotFlow?.layers)];

  async function loadAnalysis(customerId) {
    setAnalysisLoading(true);
    setAnalysisError("");
    setAnalysis(null);
    setCopied(false);

    try {
      const { data: payload, meta } = await fetchAnalysis(customerId, { withMeta: true });
      setAnalysis(payload);

      const normalizedMeta = normalizeFlowMeta(payload?._meta, meta?.latencyMs);
      setFlowByCustomer((prev) => ({
        ...prev,
        [customerId]: {
          ...(prev[customerId] || {}),
          analyze: {
            status: "ok",
            apiKeyStatus: "connected",
            message: "Analysis response received",
            ...normalizedMeta,
          },
        },
      }));

      setChatByCustomer((prev) => {
        const currentHistory = prev[customerId] || [];
        const traceId = normalizedMeta.traceId;
        const alreadyAdded = currentHistory.some(
          (item) => item.kind === "analysis-brief" && item.traceId === traceId
        );

        if (alreadyAdded) return prev;

        return {
          ...prev,
          [customerId]: [
            ...currentHistory,
            {
              role: "assistant",
              kind: "analysis-brief",
              traceId,
              content: buildAnalysisBrief(payload),
            },
          ],
        };
      });
    } catch (err) {
      const missingKey = /Missing QWEN_API_KEY/i.test(err?.message || "");
      setAnalysisError(err.message);

      setFlowByCustomer((prev) => ({
        ...prev,
        [customerId]: {
          ...(prev[customerId] || {}),
          analyze: {
            status: "failed",
            apiKeyStatus: missingKey ? "missing" : "unknown",
            message: err.message,
            ...normalizeFlowMeta(err.meta, err.latencyMs),
          },
        },
      }));

      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [
          ...(prev[customerId] || []),
          {
            role: "assistant",
            kind: "error",
            content: `Analysis failed: ${err.message}`,
          },
        ],
      }));
    } finally {
      setAnalysisLoading(false);
    }
  }

  function handleAnalyzeClick(customer) {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
    setChatInput("");

    setChatByCustomer((prev) => {
      if (prev[customer.customer_id]) return prev;
      return {
        ...prev,
        [customer.customer_id]: [
          {
            role: "assistant",
            kind: "welcome",
            content:
              "Copilot channel is live. You can ask for objection handling, quantified evidence, and compliant call scripts.",
          },
        ],
      };
    });

    loadAnalysis(customer.customer_id);
  }

  async function handleCopyScript() {
    if (!analysis?.sales_pitch_script) return;
    await navigator.clipboard.writeText(analysis.sales_pitch_script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  async function handleSendMessage(overrideText) {
    if (!selectedCustomer) return;
    const message = (overrideText || chatInput).trim();
    if (!message || chatLoading) return;

    const customerId = selectedCustomer.customer_id;
    const baseHistory = chatByCustomer[customerId] || [];
    const nextHistory = [...baseHistory, { role: "user", content: message }];

    setChatByCustomer((prev) => ({
      ...prev,
      [customerId]: nextHistory,
    }));

    setChatInput("");
    setChatLoading(true);

    try {
      const { data: payload, meta } = await sendCopilotMessage(
        customerId,
        message,
        nextHistory.slice(-8),
        { withMeta: true }
      );

      const reply = String(payload?.reply || "").trim();
      if (!reply) throw new Error("Qwen returned an empty copilot reply");

      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [...(prev[customerId] || []), { role: "assistant", content: reply }],
      }));

      setFlowByCustomer((prev) => ({
        ...prev,
        [customerId]: {
          ...(prev[customerId] || {}),
          copilot: {
            status: "ok",
            message: "Copilot response received",
            ...normalizeFlowMeta(payload?._meta, meta?.latencyMs),
          },
        },
      }));
    } catch (err) {
      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [
          ...(prev[customerId] || []),
          {
            role: "assistant",
            kind: "error",
            content: `Copilot request failed: ${err.message}`,
          },
        ],
      }));

      setFlowByCustomer((prev) => ({
        ...prev,
        [customerId]: {
          ...(prev[customerId] || {}),
          copilot: {
            status: "failed",
            message: err.message,
            ...normalizeFlowMeta(err.meta, err.latencyMs),
          },
        },
      }));
    } finally {
      setChatLoading(false);
    }
  }

  const keyStatusLabel = analyzeFlow?.apiKeyStatus === "connected"
    ? "Connected"
    : analyzeFlow?.apiKeyStatus === "missing"
      ? "Missing"
      : "Unknown";

  const keyStatusClass = analyzeFlow?.apiKeyStatus === "connected"
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : analyzeFlow?.apiKeyStatus === "missing"
      ? "text-rose-700 bg-rose-50 border-rose-200"
      : "text-slate-700 bg-slate-100 border-slate-200";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Cuca-Insider-AI</p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Enterprise Advisory Dashboard for Next Best Offer
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            AI is decision-support only. Final credit decisions remain under authorized banking officers.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((item) => (
            <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.label}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Priority Profile</p>
          {heroCustomer ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{heroCustomer.full_name}</h2>
                <p className="text-sm text-slate-500">{heroCustomer.job_title}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{toTrustScore(heroCustomer)}/100</p>
                <p className="text-xs text-slate-500">Trust Score</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Loading priority profile...</p>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Target Customer Pipeline</h2>
            <span className="text-xs font-medium text-slate-500">ALTERNATIVE DATA INTELLIGENCE</span>
          </div>

          {loading ? <p className="text-sm text-slate-500">Loading customer pipeline...</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          {!loading && !error ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-3 pr-3">Customer</th>
                    <th className="pb-3 pr-3">Behavior Signals</th>
                    <th className="pb-3 pr-3">Risk Level</th>
                    <th className="pb-3 pr-3">NBO Recommendation</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    const riskStyle = RISK_STYLES[customer.risk_score] || RISK_STYLES.Medium;
                    return (
                      <tr key={customer.customer_id} className="border-b border-gray-200 align-top">
                        <td className="py-4 pr-3">
                          <p className="font-medium text-slate-900">{customer.full_name}</p>
                          <p className="text-xs text-slate-500">{customer.job_title}</p>
                        </td>
                        <td className="py-4 pr-3">
                          <div className="flex flex-wrap gap-2">
                            {flattenTags(customer.behavioral_tags).map((item, idx) => (
                              <span
                                key={`${customer.customer_id}-${idx}`}
                                className={`rounded-full border px-2.5 py-1 text-xs ${SOURCE_BADGE[item.source]}`}
                              >
                                {item.tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 pr-3">
                          <div className="mb-1 h-2.5 w-28 rounded-full bg-slate-100">
                            <div
                              className={`h-2.5 rounded-full ${riskStyle.color}`}
                              style={{ width: riskStyle.width }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{riskStyle.label}</span>
                        </td>
                        <td className="py-4 pr-3 font-medium">{customer.recommended_nbo}</td>
                        <td className="py-4">
                          <button
                            type="button"
                            onClick={() => handleAnalyzeClick(customer)}
                            className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"
                          >
                            Run AI Analysis
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </section>

      <AnimatePresence>
        {drawerOpen && selectedCustomer ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:w-[82%] lg:w-[42%]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-sky-700">Advisory Profile</p>
                    <h3 className="text-xl font-bold">{selectedCustomer.full_name}</h3>
                    <p className="text-xs text-slate-500">
                      {selectedCustomer.customer_id} • {selectedCustomer.job_title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
                {analysisLoading ? (
                  <p className="text-sm text-slate-500">Running Qwen analysis for selected customer...</p>
                ) : null}
                {analysisError ? <p className="text-sm text-rose-600">{analysisError}</p> : null}

                {analysis ? (
                  <>
                    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">Consulting Script</h4>
                        <button
                          type="button"
                          onClick={handleCopyScript}
                          className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-blue-100"
                        >
                          <Clipboard size={14} />
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-800">{analysis.sales_pitch_script}</p>
                    </section>

                    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <h4 className="mb-3 text-sm font-semibold text-slate-900">Insight Pack</h4>
                      <details open className="mb-2 rounded-lg border border-slate-200 px-3 py-2">
                        <summary className="cursor-pointer text-sm font-medium text-slate-800">
                          Behavioral Rationale
                        </summary>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                          {safeArray(analysis.behavioral_rationale).map((item, idx) => (
                            <li key={`br-${idx}`}>{item}</li>
                          ))}
                        </ul>
                      </details>
                      <details className="rounded-lg border border-slate-200 px-3 py-2">
                        <summary className="cursor-pointer text-sm font-medium text-slate-800">
                          Quantitative Evidence
                        </summary>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                          {safeArray(analysis.statistical_evidence).map((item, idx) => (
                            <li key={`se-${idx}`}>{item}</li>
                          ))}
                        </ul>
                      </details>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {safeArray(analysis.risk_warning_and_upsell).map((warning, idx) => (
                          <span
                            key={`rw-${idx}`}
                            className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                          >
                            {warning}
                          </span>
                        ))}
                      </div>
                    </section>
                  </>
                ) : null}

                <section className="mt-4 flex min-h-[270px] flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-900">AI Copilot</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Real-time objection handling and compliant advisory guidance for frontline teams.
                  </p>

                  <section className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                        Onsite Flow Monitor
                      </p>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${keyStatusClass}`}>
                        API Key: {keyStatusLabel}
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-md bg-slate-50 px-2.5 py-2">
                        <p className="text-[11px] uppercase text-slate-500">Analyze Latency</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatLatency(analyzeFlow?.latencyMs)}
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-50 px-2.5 py-2">
                        <p className="text-[11px] uppercase text-slate-500">Copilot Latency</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatLatency(copilotFlow?.latencyMs)}
                        </p>
                      </div>
                      <div className="rounded-md bg-slate-50 px-2.5 py-2">
                        <p className="text-[11px] uppercase text-slate-500">Analyze Trace</p>
                        <p className="truncate text-sm font-semibold text-slate-800">{analyzeFlow?.traceId || "n/a"}</p>
                      </div>
                      <div className="rounded-md bg-slate-50 px-2.5 py-2">
                        <p className="text-[11px] uppercase text-slate-500">Copilot Trace</p>
                        <p className="truncate text-sm font-semibold text-slate-800">{copilotFlow?.traceId || "n/a"}</p>
                      </div>
                    </div>

                    <p className="mt-2 text-[11px] text-slate-500">
                      Last update: {formatTimestamp(copilotFlow?.updatedAt || analyzeFlow?.updatedAt)}
                    </p>

                    {activeScope ? (
                      <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
                        <p className="text-[11px] uppercase text-slate-500">Model Scope</p>
                        <p className="mt-1 text-xs text-slate-700">
                          Boundary: {activeScope.boundary || "n/a"} | PII: {activeScope.pii_handling || "n/a"}
                        </p>
                        <p className="mt-1 text-xs text-slate-700">
                          Products: {safeArray(activeScope.products_allowed).join(" | ") || "n/a"}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-2 space-y-1">
                      {layerRows.length ? (
                        layerRows.map((layer, idx) => (
                          <div
                            key={`${layer.id || "layer"}-${idx}`}
                            className="flex items-center justify-between rounded-md border border-slate-200 px-2.5 py-1.5 text-xs"
                          >
                            <span className="font-medium text-slate-700">{layerText(layer.id)}</span>
                            <span className="text-slate-500">
                              {layer.status || "n/a"} · {formatLatency(layer.latency_ms)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No layer trace yet. Run analysis first.</p>
                      )}
                    </div>
                  </section>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        disabled={chatLoading}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex-1 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3">
                    {currentChat.map((item, idx) => (
                      <div
                        key={`chat-${idx}`}
                        className={`max-w-[92%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                          item.role === "user"
                            ? "ml-auto bg-sky-600 text-white"
                            : item.kind === "error"
                              ? "mr-auto bg-rose-50 text-rose-700"
                              : "mr-auto bg-slate-100 text-slate-800"
                        }`}
                      >
                        {item.content}
                      </div>
                    ))}
                    {chatLoading ? (
                      <div className="mr-auto max-w-[92%] rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">
                        Qwen is drafting a response...
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-end gap-2">
                    <textarea
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Ask for next-step strategy, objection handling, or evidence-backed scripts..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-300 transition focus:ring"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={chatLoading || !chatInput.trim()}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
                    >
                      <SendHorizontal size={16} />
                    </button>
                  </div>
                </section>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
