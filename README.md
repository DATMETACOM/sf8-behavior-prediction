# SF8 Behavior Prediction

**Shinhan Finance Vietnam x Qwen AI Build Day 2026**

> AI-powered sales closing assistant. Analyze thin-file customers using alternative data and generate tactical Next Best Offer scripts with Qwen.

**Live Demo:** https://sf8-behavior-prediction.vercel.app

---

## Inspiration

Traditional telesales relies on manual underwriting and insufficient credit data for thin-file customers. SF8 creates a **Win-Win**:

- **Sales Teams:** AI-generated NBO scripts with behavioral rationale
- **Customers:** Faster approval, personalized offers
- **Shinhan:** Higher conversion, lower CAC

---

## What It Does

SF8 acts as a **"Sales Copilot"** powered by Qwen AI:

- **Alternative Data Analysis** — E-wallet, spending patterns, career signals
- **NBO Script Generation** — AI generates tailored sales pitch with statistical evidence
- **Risk-Aware Upsell** — Identifies cross-sell opportunities with risk warnings

**3 Portals:** Dashboard, Customer Detail, AI Copilot

---

## How We Built It

| Layer | Technology |
|-------|------------|
| Frontend | Vite + React 18, Tailwind CSS |
| AI Engine | Qwen Plus via Alibaba Cloud DashScope |
| Backend | Next.js API routes |
| Cloud | Vercel |

**AI Brain:**
- Qwen LLM for NBO script generation
- Deterministic scoring with alternative data fallback

---

## Demo (3 min)

**1. Customer Analysis**
- Select thin-file customer with limited traditional credit history
- View alternative data: e-wallet usage, spending categories, career signals

**2. AI Copilot**
- Click "Phân tích AI" → Qwen returns NBO script
- Response includes: recommended_product, behavioral_rationale, statistical_evidence, sales_pitch_script, risk_warning_and_upsell

**3. Conversion Flow**
- Copy script directly to WhatsApp
- Track conversion metrics

**Key message:** Alternative data + AI = faster approval for thin-file customers

---

## Key Metrics

| Metric | Traditional | Our Solution |
|--------|-------------|--------------|
| Credit Analysis | Manual review | Real-time AI |
| Data Sources | Payslip only | Alternative data |
| Script Generation | Manual | AI-generated |
| Time to Offer | 3-7 days | < 5 minutes |

---

## 🚀 Quick Start

```bash
npm install && npm run dev
```

Add `QWEN_API_KEY` to `.env.local` for real AI (mock fallback available).

---

## Project Structure

```
sf8-behavior-prediction/
├── src/
│   ├── views/       # Dashboard, CustomerDetail
│   ├── lib/         # Qwen integration, scoring engine
│   └── dataProvider # Mock customer data
├── api/             # Backend API routes
└── docs/            # Architecture, API docs
```

---

## Challenges Solved

- **Thin-file customers** — Alternative data fills credit gaps
- **PII compliance** — Masking before AI inference
- **Script quality** — Qwen generates explainable, personalized pitches

---

**Built for Qwen AI Build Day 2026 | Financial Services Track**
