// SF8 - Supabase Client
// Phase 2: Database integration for real customer data
// 
// Usage: Import and use in components
// import { supabase, fetchCustomers, saveScore } from './lib/supabase';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Types
export type Customer = {
  id: string;
  customer_code: string;
  name: string;
  age: number;
  income: number;
  occupation: string;
  consent_given: boolean;
  created_at: string;
  updated_at: string;
};

export type AlternativeData = {
  id: string;
  customer_id: string;
  source_type: 'telco' | 'ewallet' | 'ecommerce' | 'social';
  data: Record<string, any>;
  data_provider: string;
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

export type Product = {
  id: string;
  name: string;
  name_en: string;
  type: string;
  min_income: number;
  target_segments: string[];
  description: string;
  features: Record<string, any>;
  active: boolean;
};

export type Outreach = {
  id: string;
  customer_id: string;
  score_id: string;
  channel: 'email' | 'sms' | 'phone' | 'app' | 'branch';
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'converted' | 'rejected';
  personalized_note: string;
  sent_at: string;
  converted_at: string;
};

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  console.log('✅ Supabase connected');
} else {
  console.warn('⚠️ Supabase not configured - running in demo mode');
}

export { supabase };

// ============================================
// Data Fetching Functions
// ============================================

/**
 * Fetch all customers from Supabase
 * Falls back to empty array if not configured
 */
export async function fetchCustomers(): Promise<Customer[]> {
  if (!supabase) {
    console.log('📦 Using demo mode (no Supabase)');
    return [];
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching customers:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch alternative data for a specific customer
 */
export async function fetchAlternativeData(customerId: string): Promise<AlternativeData[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('alternative_data')
    .select('*')
    .eq('customer_id', customerId);

  if (error) {
    console.error('❌ Error fetching alternative data:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch product catalog from Supabase
 */
export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('display_order');

  if (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }

  return data || [];
}

// ============================================
// Data Writing Functions
// ============================================

/**
 * Save score record to Supabase
 * Returns score ID if successful, null otherwise
 */
export async function saveScore(
  customerId: string,
  score: {
    overallScore: number;
    breakdown: {
      pcf: number;
      bss: number;
      erq: number;
      pa: number;
    };
    recommendedProduct: string;
    action: 'push now' | 'nurture' | 'hold';
    confidence: number;
    metadata?: Record<string, any>;
  }
): Promise<string | null> {
  if (!supabase) {
    console.log('💾 Score not saved (no Supabase)');
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
      scoring_version: '1.0.0',
      scoring_engine: 'deterministic',
      metadata: score.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error saving score:', error);
    return null;
  }

  console.log('✅ Score saved:', data.id);
  return data.id;
}

/**
 * Create outreach record
 */
export async function createOutreach(
  customerId: string,
  scoreId: string,
  channel: 'email' | 'sms' | 'phone' | 'app' | 'branch',
  personalizedNote?: string
): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('outreaches')
    .insert({
      customer_id: customerId,
      score_id: scoreId,
      channel,
      status: 'pending',
      personalized_note: personalizedNote,
      scheduled_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating outreach:', error);
    return null;
  }

  return data.id;
}

/**
 * Update outreach status
 */
export async function updateOutreachStatus(
  outreachId: string,
  status: Outreach['status']
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from('outreaches')
    .update({
      status,
      [`${status}_at`]: new Date().toISOString(),
    })
    .eq('id', outreachId);

  if (error) {
    console.error('❌ Error updating outreach:', error);
    return false;
  }

  return true;
}

// ============================================
// Analytics Functions
// ============================================

/**
 * Fetch conversion funnel metrics
 */
export async function fetchConversionFunnel() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('v_conversion_funnel')
    .select('*')
    .order('date', { ascending: false })
    .limit(30);

  if (error) {
    console.error('❌ Error fetching conversion funnel:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch score distribution
 */
export async function fetchScoreDistribution() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('v_score_distribution')
    .select('*');

  if (error) {
    console.error('❌ Error fetching score distribution:', error);
    return [];
  }

  return data || [];
}

// ============================================
// Real-time Subscriptions (Phase 3)
// ============================================

/**
 * Subscribe to new scores in real-time
 */
export function subscribeToScores(callback: (score: ScoreRecord) => void) {
  if (!supabase) {
    return null;
  }

  const subscription = supabase
    .channel('scores')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'scores',
      },
      (payload) => {
        callback(payload.new as ScoreRecord);
      }
    )
    .subscribe();

  return subscription;
}

/**
 * Subscribe to outreach status changes
 */
export function subscribeToOutreaches(callback: (outreach: Outreach) => void) {
  if (!supabase) {
    return null;
  }

  const subscription = supabase
    .channel('outreaches')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'outreaches',
      },
      (payload) => {
        callback(payload.new as Outreach);
      }
    )
    .subscribe();

  return subscription;
}
