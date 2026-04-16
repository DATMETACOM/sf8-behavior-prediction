import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clipboard, SendHorizontal, X } from "lucide-react";
import { fetchAnalysis, fetchCustomers, sendCopilotMessage } from "../services/api.js";

const KPI_CARDS = [
  { label: "Tổng khách hàng mục tiêu", value: 20 },
  { label: "Danh sách ưu tiên tiếp cận", value: 3 },
  { label: "Danh sách chăm sóc định kỳ", value: 14 },
  { label: "Điểm tín nhiệm bình quân", value: 68 },
];

const QUICK_PROMPTS = [
  "Khách hàng phản biện lãi suất",
  "Tra cứu chính sách hoàn tiền",
  "Yêu cầu dẫn chứng thuyết phục",
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

  const currentChat = selectedCustomer ? chatByCustomer[selectedCustomer.customer_id] || [] : [];

  async function loadAnalysis(customerId) {
    setAnalysisLoading(true);
    setAnalysisError("");
    setAnalysis(null);
    setCopied(false);
    try {
      const payload = await fetchAnalysis(customerId);
      setAnalysis(payload);
    } catch (err) {
      setAnalysisError(err.message);
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
            content:
              "Xin chào. Tôi sẵn sàng hỗ trợ chiến lược tư vấn. Anh/chị có thể hỏi về phản biện lãi suất, quyền lợi hoàn tiền hoặc dẫn chứng phù hợp hồ sơ khách hàng.",
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
      const payload = await sendCopilotMessage(customerId, message, nextHistory.slice(-8));
      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [
          ...(prev[customerId] || []),
          { role: "assistant", content: payload.reply },
        ],
      }));
    } catch (err) {
      setChatByCustomer((prev) => ({
        ...prev,
        [customerId]: [
          ...(prev[customerId] || []),
          {
            role: "assistant",
            content: `Kết nối Qwen không thành công: ${err.message}. Vui lòng thử lại.`,
          },
        ],
      }));
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            Cuca-Insider-AI
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            CRM Advisory Dashboard cho Next Best Offer (NBO)
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Lưu ý: AI chỉ đóng vai trò phân tích và khuyến nghị, không thay thế quyết định giải
            ngân.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {KPI_CARDS.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.label}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Khách hàng ưu tiên
          </p>
          {heroCustomer ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{heroCustomer.full_name}</h2>
                <p className="text-sm text-slate-500">{heroCustomer.job_title}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">
                  {toTrustScore(heroCustomer)}/100
                </p>
                <p className="text-xs text-slate-500">Điểm ưu tiên</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Đang tải hồ sơ ưu tiên...</p>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Danh sách khách hàng tiềm năng (Pipeline)</h2>
            <span className="text-xs font-medium text-slate-500">ALTERNATIVE DATA INTELLIGENCE</span>
          </div>

          {loading ? <p className="text-sm text-slate-500">Đang tải danh mục khách hàng...</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          {!loading && !error ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-3 pr-3">Khách hàng</th>
                    <th className="pb-3 pr-3">Tín hiệu hành vi (Alternative Data)</th>
                    <th className="pb-3 pr-3">Rủi ro tín dụng</th>
                    <th className="pb-3 pr-3">Đề xuất NBO</th>
                    <th className="pb-3">Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    const riskStyle = RISK_STYLES[customer.risk_score];
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
                            Phân tích AI
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
              className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:w-[82%] lg:w-[40%]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-sky-700">Hồ sơ tác chiến</p>
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
                  <p className="text-sm text-slate-500">Đang xử lý phân tích Qwen cho hồ sơ khách hàng...</p>
                ) : null}
                {analysisError ? <p className="text-sm text-rose-600">{analysisError}</p> : null}

                {analysis ? (
                  <>
                    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">Kịch bản tư vấn (Script Box)</h4>
                        <button
                          type="button"
                          onClick={handleCopyScript}
                          className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-blue-100"
                        >
                          <Clipboard size={14} />
                          {copied ? "Đã sao chép" : "Sao chép"}
                        </button>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-800">
                        {analysis.sales_pitch_script}
                      </p>
                    </section>

                    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <h4 className="mb-3 text-sm font-semibold text-slate-900">Insight</h4>
                      <details open className="mb-2 rounded-lg border border-slate-200 px-3 py-2">
                        <summary className="cursor-pointer text-sm font-medium text-slate-800">
                          Luận điểm hành vi (behavioral_rationale)
                        </summary>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                          {safeArray(analysis.behavioral_rationale).map((item, idx) => (
                            <li key={`br-${idx}`}>{item}</li>
                          ))}
                        </ul>
                      </details>
                      <details className="rounded-lg border border-slate-200 px-3 py-2">
                        <summary className="cursor-pointer text-sm font-medium text-slate-800">
                          Dẫn chứng định lượng (statistical_evidence)
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
                    Gợi ý phương án xử lý phản biện theo chuẩn tư vấn tài chính.
                  </p>

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
                        className={`max-w-[88%] rounded-lg px-3 py-2 text-sm ${
                          item.role === "user"
                            ? "ml-auto bg-sky-600 text-white"
                            : "mr-auto bg-slate-100 text-slate-800"
                        }`}
                      >
                        {item.content}
                      </div>
                    ))}
                    {chatLoading ? (
                      <div className="mr-auto max-w-[88%] rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">
                        Qwen đang soạn phản hồi...
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-end gap-2">
                    <textarea
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Đặt câu hỏi cho Qwen về phương án xử lý từ chối hoặc điều khoản sản phẩm cho khách hàng này..."
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
