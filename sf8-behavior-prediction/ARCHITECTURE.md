# SF8 Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Customer List│  │Customer View│  │Product View │            │
│  │  (page.tsx) │  │customers/[id]│  │  (modal)    │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                     │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Mock Data Generator                    │   │
│  │  - 20 customers                                          │   │
│  │  - Alternative data (telco, e-wallet, ecommerce, social) │   │
│  │  - 7 Shinhan Finance products                            │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │                   TypeScript Interfaces                   │   │
│  │  - Customer, AlternativeData, ShinhanProduct            │   │
│  │  - BehaviorPrediction, QwenBehaviorRequest              │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Qwen API Layer   │ (TBD - Pending Key)
                    │  - Prompt Template │
                    │  - API Call         │
                    │  - Response Parser  │
                    │  - Rule-based Fallback│
                    └─────────────────────┘
```

---

## Component Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Customer list dashboard
│   ├── globals.css             # Global styles
│   ├── customers/
│   │   └── [id]/
│   │       └── page.tsx        # Customer detail with AI prediction
│   └── api/
│       ├── customers/
│       │   ├── route.ts        # GET all customers
│       │   └── [id]/
│       │       └── route.ts    # GET customer by ID
│       └── predict/
│           └── route.ts        # POST: Get behavior prediction
│
├── lib/
│   ├── data.ts                 # Mock data & generators
│   │   ├── CUSTOMERS           # 20 customer objects
│   │   ├── ALTERNATIVE_DATA    # Alternative data per customer
│   │   ├── PRODUCTS            # 7 Shinhan Finance products
│   │   ├── getCustomer()       # Get customer by ID
│   │   ├── getAlternativeData() # Get alternative data
│   │   └── getEligibleProducts() # Filter products by income
│   │
│   └── qwen.ts                 # Qwen API client
│       ├── predictBehavior()   # Main prediction function
│       ├── buildBehaviorPrompt()
│       ├── parseBehaviorResponse()
│       ├── mockBehaviorPrediction() # Rule-based fallback
│       ├── getConfidenceLabel()
│       └── getConfidenceColor()
│
└── types/
    └── index.ts                 # TypeScript interfaces
```

---

## Data Flow

### Customer List Flow
```
User → Dashboard (/)
       ↓
   Fetch CUSTOMERS
       ↓
   Display Customer Cards (20 customers)
```

### Customer Detail Flow
```
User → Click Customer → /customers/[id]
                       ↓
              Fetch customer + alternative data
                       ↓
              Call predictBehavior() with Qwen
                       ↓
              Display: Profile + Alternative Data + AI Recommendation
```

### Prediction Flow (with Qwen API - TBD)
```
User → Select Customer → Click Predict
       ↓
   Fetch customer profile + alternative data
       ↓
   Build prompt with:
   - Telco spending, tenure, data usage
   - E-wallet usage, transactions, categories
   - E-commerce orders, value, categories
   - Social interests, activity
       ↓
   Call Qwen API with prompt
       ↓
   Parse JSON response
       ↓
   Display: Recommended product + confidence + reason + offer details
```

---

## State Management

**Current:** No state management (React Server Components)

**Future (Enhancement):**
- React Context for global state
- Zustand/Jotai for client state
- SWR/React Query for API caching

---

## Styling Architecture

```
Tailwind CSS (utility-first)
├── globals.css             # Global styles + CSS variables
├── Tailwind config         # Theme customization
└── Inline utility classes  # Component styling
```

**Color Scheme:**
- Primary: Red-700/Red-900 (Shinhan Finance brand)
- Secondary: White, Gray-50
- Accent: Purple (Qwen AI badge)
- Confidence: Green (high), Yellow (medium), Red (low)

---

## API Routes

```
/api/
├── customers/
│   ├── route.ts            # GET: All customers
│   └── [id]/
│       └── route.ts        # GET: Customer by ID with alt data
└── predict/
    └── route.ts            # POST: Behavior prediction
```

---

## Rule-Based Fallback Logic

When Qwen API is unavailable, SF8 uses rule-based matching:

1. **High e-commerce (≥8 orders/month)** → Cashback Credit Card
2. **Tech interest + Young (<35)** → Platinum Credit Card
3. **Business interest + High income (≥20M)** → SME Loan
4. **Health/Family interest** → Health Insurance
5. **High e-wallet usage (≥40 transactions)** → BNPL
6. **Default** → Salary Loan

Confidence calculation:
- Base: 0.6
- +0.1 if ecommerce orders > 0
- +0.1 if e-wallet transactions > 30
- +0.1 if social interests > 2
- +0.1 if income > product minIncome * 1.5

---

## Security Considerations

| Concern | Status | Notes |
|----------|--------|-------|
| API Key | Pending | Store in .env.local (gitignored) |
| Data Validation | Mock only | Add Zod validation for production |
| Authentication | None | Add for production |
| Rate Limiting | None | Add for Qwen API calls |

---

## Deployment

### Development
```bash
cd sf8-behavior-prediction
npm install
npm run dev  # http://localhost:3000
```

### Production
```bash
npm run build
npm start
```

### Vercel (Recommended)
```bash
vercel deploy
```

---

## Monitoring & Logging (Future)

- **Error Tracking:** Sentry
- **Analytics:** Vercel Analytics
- **Logging:** Pino / Winston
- **APM:** New Relic / DataDog
