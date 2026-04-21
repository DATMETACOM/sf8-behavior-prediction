# 🏦 Cuca-Insider-AI - AI-powered Sales Closing Assistant

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

## 🧠 Architecture Overview

The backend follows a strict 4-layer pipeline:

1. **Native Calculation**
   - Load customer deterministic stats and behavioral tags from `customers_data.json`.
2. **PII Masking**
   - Remove `full_name` and `phone` before sending payload to Qwen.
3. **Qwen AI Inference**
   - Qwen returns strict JSON fields:
     `recommended_product`, `behavioral_rationale`, `statistical_evidence`, `sales_pitch_script`, `risk_warning_and_upsell`.
4. **UI Rendering (Unmasking)**
   - Backend merges AI output with original customer name and serves the tactical drawer UI.

This architecture keeps customer privacy boundaries explicit while still enabling AI-powered sales recommendations.

---

## How We Built It

| Layer | Technology |
|-------|------------|
| Frontend | Vite + React 18, Tailwind CSS |
| AI Engine | Qwen3-Max via Alibaba Cloud DashScope |
| Backend | FastAPI (Python) + Next.js API routes |
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

## ✅ Prerequisites

- Node.js 18+
- Python 3.10+

## ⚙️ Setup Instructions

### 1) Backend (FastAPI)

```bash
cd backend
python -m pip install -r requirements.txt
cp .env.example .env
```

Update `.env`:

```env
QWEN_API_KEY=your_real_qwen_api_key
BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen3-max
```

Generate mock dataset (JSON + CSV):

```bash
python generate_mock_data.py
```

Run API server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Frontend (React + Vite + Tailwind)

```bash
cd ..
npm install
npm run dev
```

Open: `http://localhost:5173`

> Vite proxy is configured, so frontend calls `http://127.0.0.1:8000/api` automatically in local development.

---

## 🧪 How To Test (Demo Guide)

1. Use the provided `backend/SF8_Customers_Mock.csv` as the official mock input file for judges.
2. Start backend and frontend.
3. Open Dashboard and review:
   - KPI cards
   - Hero customer
   - Pipeline table with clear **Alternative Data** tags.
4. Click **"Phân tích AI"** on any customer row.
5. Verify tactical drawer:
   - Script Box (`sales_pitch_script`) + copy button
   - Insight lists (`behavioral_rationale`, `statistical_evidence`)
   - Risk badges (`risk_warning_and_upsell`)
   - Copilot chatbox with quick prompts.

---

## 📁 Key Files

- `backend/generate_mock_data.py`
- `backend/customers_data.json`
- `backend/SF8_Customers_Mock.csv`
- `backend/Product_Catalog.json`
- `backend/main.py`
- `src/components/Dashboard.jsx`

---

## Challenges Solved

- **Thin-file customers** — Alternative data fills credit gaps
- **PII compliance** — Masking before AI inference
- **Script quality** — Qwen generates explainable, personalized pitches

---

## ⚠️ Disclaimer

AI is used as a tactical analysis assistant. Final lending/approval decisions must remain under authorized Shinhan officers.

---

**Built for Qwen AI Build Day 2026 | Financial Services Track**
