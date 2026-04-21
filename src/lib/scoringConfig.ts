export const SCORING_WEIGHTS = {
  pcf: 0.20,  // Partner/Channel Fit
  bss: 0.30,  // Behavioral Score
  erq: 0.15,  // External/Relationship Quality
  pa: 0.35    // Product Affinity
} as const

export const SCORING_THRESHOLDS = {
  pushNow: { overallScore: 75, productAffinity: 70 },
  nurture: { overallScore: 50, productAffinity: 50 }
} as const

export const SCORE_BOUNDS = { min: 0, max: 100 } as const
