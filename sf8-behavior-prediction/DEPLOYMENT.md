# SF8 - Deployment Guide (3 Phases)

> **Repository**: https://github.com/DATMETACOM/kts-qwen-ai
> **Branch**: develop
> **Subfolder**: `sf8-behavior-prediction/`

---

## 📋 Table of Contents

1. [Phase 1: Vercel Frontend (NOW - 5 minutes)](#phase-1-vercel-frontend)
2. [Phase 2: Supabase Database (LATER - 2-3 hours)](#phase-2-supabase-database)
3. [Phase 3: Production Pilot (FUTURE - 2-4 weeks)](#phase-3-production-pilot)

---

## Phase 1: Vercel Frontend

**Goal**: Deploy SF8 as static site for demo/judges

**Architecture**:
```
Browser → Vercel CDN (Static Files) → All logic runs in browser
```

**Cost**: FREE (Vercel Hobby tier)
**Time**: 5 minutes

---

### Step 1: Create Vercel Account

1. Go to: https://vercel.com/signup
2. Sign up with GitHub account
3. Link to: `DATMETACOM/kts-qwen-ai`

---

### Step 2: Deploy via Dashboard (Recommended)

#### Option A: Vercel Dashboard

1. **Import Repository**:
   - Go to: https://vercel.com/new
   - Click "Import Git Repository"
   - Select: `DATMETACOM/kts-qwen-ai`

2. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: kts-qwen-ai/sf8-behavior-prediction
   Build Command: npm install && npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables** (optional):
   ```
   DASHSCOPE_API_KEY=sk-xxxxx  (optional - app works without it)
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Get URL: `https://sf8-behavior-prediction.vercel.app`

---

#### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to SF8 folder
cd sf8-behavior-prediction

# First deploy (preview)
vercel

# Follow prompts:
# ? Set up and deploy? → Y
# ? Which scope? → Your account
# ? Link to existing project? → N
# ? Project name? → sf8-behavior-prediction
# ? Directory? → ./
# ? Override settings? → N

# Production deploy
vercel --prod
```

---

### Step 3: Verify Deployment

1. **Open URL**: `https://sf8-behavior-prediction.vercel.app`
2. **Check**:
   - ✅ Dashboard loads with 20 customers
   - ✅ Customer detail page works
   - ✅ Simulation works
   - ✅ Export/Pitch works
   - ✅ No console errors

3. **Test Routes**:
   - `/` → Dashboard
   - `/customer/c001` → Hero case (Nguyễn Văn An)
   - `/simulation` → What-if workspace
   - `/export` → Report generation

---

### Step 4: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add custom domain: `sf8.yourdomain.com`
3. Add DNS record (CNAME) pointing to `cname.vercel-dns.com`
4. Wait for SSL certificate (automatic)

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build fails** | Check `vercel.json` exists in `sf8-behavior-prediction/` |
| **404 on routes** | Verify `rewrites` in `vercel.json` |
| **Qwen not working** | Check `DASHSCOPE_API_KEY` in Vercel env vars |
| **Slow loading** | Assets cached with `Cache-Control` header (see vercel.json) |

---

### Auto-Deploy on Push

Vercel automatically deploys when you push to `develop` branch:

```bash
git push origin develop
# → Vercel detects change → Rebuilds → Deploys automatically
```

**Preview Deployments**: Each PR gets a unique preview URL!

---

## Phase 2: Supabase Database

**Goal**: Add database for real customer data and score tracking

**When**: After InnoBoost POC approval (200M VND contract)

**Architecture**:
```
Browser → Vercel (Frontend) → Supabase (PostgreSQL) → Qwen API
```

**Cost**: FREE (Supabase tier: 500MB DB, 2GB bandwidth)
**Time**: 2-3 hours setup

---

### Step 1: Create Supabase Project

1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Configure:
   ```
   Project Name: sf8-behavior-prediction
   Database Password: (generate strong password)
   Region: Southeast Asia (Singapore) - closest to Vietnam
   ```

4. **Save Credentials**:
   - Project URL: `https://xxxxx.supabase.co`
   - API Key (public): `eyJxxx...`
   - Database Password: (keep secret)

---

### Step 2: Create Database Tables

Run in Supabase SQL Editor:

```sql
-- Customer profiles
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 65),
  income NUMERIC(15,2) CHECK (income > 0),
  occupation VARCHAR(100),
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alternative data sources
CREATE TABLE alternative_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  source_type VARCHAR(20) CHECK (source_type IN ('telco', 'ewallet', 'ecommerce', 'social')),
  data JSONB NOT NULL,
  data_provider VARCHAR(50),
  consent_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(customer_id, source_type)
);

-- Score records
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  pcf_score INTEGER,
  bss_score INTEGER,
  erq_score INTEGER,
  pa_score INTEGER,
  recommended_product_id VARCHAR(50),
  action VARCHAR(20) CHECK (action IN ('push now', 'nurture', 'hold')),
  confidence NUMERIC(3,2),
  scored_at TIMESTAMP DEFAULT NOW(),
  scoring_version VARCHAR(20) DEFAULT '1.0.0',
  metadata JSONB
);

-- Product catalog
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('credit_card', 'personal_loan', 'sme_loan', 'insurance', 'bnpl')),
  min_income NUMERIC(15,2),
  target_segments TEXT[],
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Outreach tracking
CREATE TABLE outreaches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  score_id UUID REFERENCES scores(id),
  channel VARCHAR(20) CHECK (channel IN ('email', 'sms', 'phone', 'app')),
  status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'opened', 'clicked', 'converted', 'rejected')),
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  converted_at TIMESTAMP,
  notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_scores_customer ON scores(customer_id, scored_at DESC);
CREATE INDEX idx_alternative_data_customer ON alternative_data(customer_id);
CREATE INDEX idx_outreaches_status ON outreaches(status, sent_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreaches ENABLE ROW LEVEL SECURITY;

-- Public read access for products (catalog)
CREATE POLICY "Products are viewable by all"
  ON products FOR SELECT
  USING (active = TRUE);

-- Authenticated users can manage data
-- (Will be configured when authentication is set up)
```

---

### Step 3: Seed Product Catalog

```sql
-- Insert 7 Shinhan Finance products
INSERT INTO products (id, name, type, min_income, target_segments, description) VALUES
('cc_cashback', 'Thẻ tín dụng Cashback', 'credit_card', 15000000, 
  ARRAY['digital_native', 'young_professional'],
  'Hoàn tiền 5-10% cho mua sắm online'),

('cc_travel', 'Thẻ tín dụng Du lịch', 'credit_card', 20000000,
  ARRAY['frequent_traveler', 'high_income'],
  'Tích dặm bay, bảo hiểm du lịch'),

('pl_personal', 'Vay cá nhân Shinhan', 'personal_loan', 10000000,
  ARRAY['salaried', 'stable_income'],
  'Vay tín chấp lãi suất ưu đãi'),

('pl_sme', 'Vay doanh nghiệp nhỏ', 'sme_loan', 30000000,
  ARRAY['business_owner', 'freelancer'],
  'Vay vốn cho SME và hộ kinh doanh'),

('ins_health', 'Bảo hiểm sức khỏe', 'insurance', 12000000,
  ARRAY['family', 'middle_age'],
  'Bảo hiểm toàn diện chi phí y tế'),

('ins_life', 'Bảo hiểm nhân thọ', 'insurance', 15000000,
  ARRAY['breadwinner', 'long_term_planner'],
  'Bảo vệ tài chính gia đình'),

('bnpl_installment', 'Mua trước trả sau', 'bnpl', 8000000,
  ARRAY['young_adult', 'first_time_buyer'],
  'Trả góp 0% cho đơn hàng online')
ON CONFLICT (id) DO NOTHING;
```

---

### Step 4: Add Supabase to SF8 App

#### Install Supabase Client

```bash
cd sf8-behavior-prediction
npm install @supabase/supabase-js
```

#### Create Supabase Client

Create `sf8-behavior-prediction/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase not configured - using demo mode');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type definitions
export type Customer = {
  id: string;
  customer_code: string;
  name: string;
  age: number;
  income: number;
  occupation: string;
  consent_given: boolean;
  created_at: string;
};

export type ScoreRecord = {
  id: string;
  customer_id: string;
  overall_score: number;
  pcf_score: number;
  bss_score: number;
  erq_score: number;
  pa_score: number;
  recommended_product_id: string;
  action: 'push now' | 'nurture' | 'hold';
  confidence: number;
  scored_at: string;
};

// Data fetching functions
export async function fetchCustomers(): Promise<Customer[]> {
  if (!supabase) {
    // Fallback to demo data
    console.log('Using demo mode (no Supabase)');
    return [];
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return data || [];
}

export async function saveScore(customerId: string, score: any): Promise<string | null> {
  if (!supabase) {
    console.log('Score not saved (no Supabase)');
    return null;
  }

  const { data, error } = await supabase
    .from('scores')
    .insert({
      customer_id: customerId,
      overall_score: score.overallScore,
      pcf_score: score.breakdown.pcf,
      bss_score: score.breakdown.bss,
      erq_score: score.breakdown.erq,
      pa_score: score.breakdown.pa,
      recommended_product_id: score.recommendedProduct,
      action: score.action,
      confidence: score.confidence,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving score:', error);
    return null;
  }

  return data.id;
}
```

---

### Step 5: Add Environment Variables

#### Vercel Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
DASHSCOPE_API_KEY=sk-xxxxx (optional)
```

#### Local Development

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
DASHSCOPE_API_KEY=sk-xxxxx
```

---

### Step 6: Migration Plan (Demo → Real Data)

```typescript
// dataProvider.ts - Hybrid approach
import { customers as demoCustomers, altData as demoAltData } from './lib/data';
import { supabase, fetchCustomers } from './lib/supabase';

export async function getCustomers() {
  // Try Supabase first
  if (supabase) {
    const realCustomers = await fetchCustomers();
    if (realCustomers.length > 0) {
      return realCustomers;
    }
  }

  // Fallback to demo data
  console.log('Using demo customers');
  return demoCustomers;
}

export async function getAlternativeData(customerId: string) {
  if (supabase) {
    const { data } = await supabase
      .from('alternative_data')
      .select('*')
      .eq('customer_id', customerId);
    
    if (data && data.length > 0) {
      return data;
    }
  }

  // Fallback to demo data
  return demoAltData[customerId];
}
```

---

## Phase 3: Production Pilot

**Goal**: Deploy for Shinhan pilot with authentication, partner APIs, ML

**When**: After successful InnoBoost POC validation

**Architecture**:
```
Browser → Vercel (Frontend + API Routes)
  ↓
Supabase (Auth + Database)
  ↓
Partner APIs (Telco, E-wallet, E-commerce)
  ↓
Qwen API (AI explanations)
  ↓
ML Pipeline (Score optimization)
```

**Cost**: ~$25/month (Vercel Pro + Supabase Pro)
**Time**: 2-4 weeks

---

### Step 1: Authentication

#### Option A: Supabase Auth (Recommended)

```typescript
import { supabase } from './lib/supabase';

// Login with Shinhan SSO
async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data.user;
}

// Protected routes
async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session.user;
}
```

#### Option B: Shinhan SSO Integration

```typescript
// Integrate with Shinhan's existing SSO
async function loginWithShinhanSSO(token: string) {
  const response = await fetch('/api/auth/shinhan-sso', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error('SSO validation failed');
  
  const user = await response.json();
  return user;
}
```

---

### Step 2: API Routes (Vercel Serverless)

Create `sf8-behavior-prediction/api/`:

#### `/api/score.ts` - Score Customer

```typescript
import { scoreCustomer } from '../lib/scoring';
import { supabase } from '../lib/supabase';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, alternativeData } = req.body;

  // Score customer (deterministic)
  const score = scoreCustomer(customerId, alternativeData, products);

  // Save to database
  if (supabase) {
    await supabase.from('scores').insert({
      customer_id: customerId,
      overall_score: score.overallScore,
      pcf_score: score.breakdown.pcf,
      bss_score: score.breakdown.bss,
      erq_score: score.breakdown.erq,
      pa_score: score.breakdown.pa,
      recommended_product_id: score.recommendedProduct,
      action: score.action,
      confidence: score.confidence,
    });
  }

  res.status(200).json(score);
}
```

#### `/api/partners/telco.ts` - Fetch Telco Data

```typescript
import { supabase } from '../../lib/supabase';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { customerId } = req.query;

  // Fetch from partner API (e.g., Viettel, VNPT, Mobifone)
  const response = await fetch(`https://partner-api.telco.com/customers/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.TELCO_API_KEY}`,
    },
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to fetch telco data' });
  }

  const telcoData = await response.json();

  // Save to Supabase
  if (supabase) {
    await supabase.from('alternative_data').upsert({
      customer_id: customerId,
      source_type: 'telco',
      data: telcoData,
      data_provider: 'viettel',
    });
  }

  res.status(200).json(telcoData);
}
```

---

### Step 3: Rate Limiting

Create `lib/rateLimiter.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests/minute
});

// Usage in API routes
export async function checkRateLimit(ip: string) {
  const { success } = await rateLimiter.limit(ip);
  
  if (!success) {
    throw new Error('Rate limit exceeded');
  }
}
```

---

### Step 4: Audit Logging

```sql
-- Audit log table
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
```

---

### Step 5: ML Training Pipeline (Future)

```python
# ml/training/train_model.py
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
import joblib

# Fetch training data from Supabase
def fetch_training_data():
    from supabase import create_client
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    response = supabase.table('scores').select('''
        *,
        customers(income, age, occupation),
        alternative_data(data),
        outreaches(status)
    ''').execute()
    
    return response.data

# Train model
def train_model():
    data = fetch_training_data()
    
    # Features
    X = data[['pcf_score', 'bss_score', 'erq_score', 'pa_score', 
              'income', 'age', 'telco_spend', 'ewallet_usage']]
    
    # Target: converted (1 if outreach status = 'converted', else 0)
    y = (data['outreaches.status'] == 'converted').astype(int)
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    # Train
    model = GradientBoostingClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    
    # Evaluate
    accuracy = model.score(X_test, y_test)
    print(f'Model accuracy: {accuracy:.2%}')
    
    # Save
    joblib.dump(model, 'models/score_predictor.pkl')
    
    return model

if __name__ == '__main__':
    train_model()
```

---

## 📊 Cost Breakdown

### Phase 1: Vercel Frontend (NOW)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | **FREE** |
| **Total** | | **$0/month** |

---

### Phase 2: Supabase Database (LATER)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | FREE |
| Supabase | Free | FREE (500MB DB, 2GB bandwidth) |
| **Total** | | **$0/month** |

---

### Phase 3: Production Pilot (FUTURE)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20/month |
| Supabase | Pro | $25/month |
| Upstash Redis | Free tier | FREE (10K commands/day) |
| Qwen API | Pay-per-use | ~$5/month |
| **Total** | | **~$50/month** |

---

## 🎯 Deployment Checklist

### Phase 1 Checklist (Vercel)

- [ ] Vercel account created
- [ ] GitHub repo connected
- [ ] `vercel.json` created
- [ ] Environment variables set (optional)
- [ ] First deploy successful
- [ ] All routes working (`/`, `/customer/:id`, `/simulation`, `/export`)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Custom domain added (optional)

---

### Phase 2 Checklist (Supabase)

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Product catalog seeded
- [ ] Row Level Security enabled
- [ ] Supabase client added to SF8
- [ ] Environment variables configured
- [ ] Hybrid mode working (demo → real data)
- [ ] Data migration plan documented

---

### Phase 3 Checklist (Production)

- [ ] Authentication integrated (Shinhan SSO)
- [ ] API routes deployed
- [ ] Partner APIs connected
- [ ] Rate limiting enabled
- [ ] Audit logging enabled
- [ ] ML training pipeline ready
- [ ] Load testing passed
- [ ] Security audit completed
- [ ] Shinhan compliance approved
- [ ] Pilot users onboarded

---

## 🚀 Quick Start Commands

### Deploy Phase 1 (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to SF8
cd sf8-behavior-prediction

# Deploy
vercel --prod

# Get URL
vercel ls
```

### Deploy Phase 2 (Supabase)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref xxxxx

# Push migrations
supabase db push

# Seed data
supabase db seed
```

### Deploy Phase 3 (Production)

```bash
# Upgrade Vercel to Pro
vercel upgrade

# Deploy API routes
vercel --prod

# Run ML training
python ml/training/train_model.py

# Monitor
vercel logs
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Deploy**: https://vitejs.dev/guide/static-deploy.html
- **React Router**: https://reactrouter.com/en/main

---

**Last Updated**: April 14, 2026
**Version**: 1.0.0
**Maintained By**: SF8 Team
