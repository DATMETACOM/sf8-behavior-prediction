// SF8 - Demo Data (20 customers)

import { AlternativeData, Customer, Product } from '../types'

interface ProfileSeed {
  id: string
  name: string
  age: number
  income: number
  occupation: string
}

interface RawAlternativeData {
  telco: {
    monthlySpend: number
    tenure: number
    dataUsage: number
  }
  eWallet: {
    usage: 'low' | 'medium' | 'high'
    monthlyTransactions: number
    categories: string[]
  }
  ecommerce: {
    monthlyOrders: number
    avgOrderValue: number
    categories: string[]
  }
  social: {
    interests: string[]
    activity: 'low' | 'medium' | 'high'
    postFrequency: number
  }
}

const PROFILE_SEEDS: ProfileSeed[] = [
  { id: 'c001', name: 'Nguyen Van An', age: 28, income: 15000000, occupation: 'Software Engineer' },
  { id: 'c002', name: 'Tran Thi Binh', age: 32, income: 22000000, occupation: 'Marketing Manager' },
  { id: 'c003', name: 'Le Hoang Cuong', age: 25, income: 8000000, occupation: 'Freelancer' },
  { id: 'c004', name: 'Pham Minh Dung', age: 35, income: 35000000, occupation: 'Director' },
  { id: 'c005', name: 'Hoang Van Em', age: 29, income: 12000000, occupation: 'Sales Executive' },
  { id: 'c006', name: 'Do Thi Loan', age: 27, income: 10000000, occupation: 'Office Staff' },
  { id: 'c007', name: 'Vu Quoc Huy', age: 41, income: 45000000, occupation: 'Business Owner' },
  { id: 'c008', name: 'Bui Thi Huong', age: 30, income: 18000000, occupation: 'Teacher' },
  { id: 'c009', name: 'Dinh Van Kien', age: 26, income: 9500000, occupation: 'Delivery Rider' },
  { id: 'c010', name: 'Ngo Thi Lan', age: 38, income: 28000000, occupation: 'Accountant' },
  { id: 'c011', name: 'Duong Van Manh', age: 33, income: 25000000, occupation: 'Doctor' },
  { id: 'c012', name: 'Vo Thi Nga', age: 24, income: 7000000, occupation: 'Student' },
  { id: 'c013', name: 'Ly Van Phong', age: 36, income: 32000000, occupation: 'Lawyer' },
  { id: 'c014', name: 'Hoang Thi Quynh', age: 31, income: 20000000, occupation: 'HR Specialist' },
  { id: 'c015', name: 'Truong Van Sang', age: 28, income: 13000000, occupation: 'IT Support' },
  { id: 'c016', name: 'Le Thi Thao', age: 34, income: 27000000, occupation: 'Pharmacist' },
  { id: 'c017', name: 'Nguyen Van Tu', age: 29, income: 16000000, occupation: 'Graphic Designer' },
  { id: 'c018', name: 'Pham Thi Uyen', age: 40, income: 40000000, occupation: 'CEO' },
  { id: 'c019', name: 'Vo Van Vinh', age: 27, income: 11000000, occupation: 'Content Creator' },
  { id: 'c020', name: 'Le Thi Xuan', age: 37, income: 30000000, occupation: 'Banker' }
]

const RAW_ALT_DATA: Record<string, RawAlternativeData> = {
  c001: {
    telco: { monthlySpend: 300000, tenure: 36, dataUsage: 15 },
    eWallet: { usage: 'high', monthlyTransactions: 45, categories: ['food', 'transport', 'shopping'] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 500000, categories: ['electronics', 'books'] },
    social: { interests: ['technology', 'gaming', 'travel'], activity: 'high', postFrequency: 15 }
  },
  c002: {
    telco: { monthlySpend: 450000, tenure: 48, dataUsage: 25 },
    eWallet: { usage: 'high', monthlyTransactions: 60, categories: ['food', 'travel', 'shopping', 'beauty'] },
    ecommerce: { monthlyOrders: 15, avgOrderValue: 800000, categories: ['fashion', 'cosmetics', 'home'] },
    social: { interests: ['fashion', 'travel', 'food'], activity: 'high', postFrequency: 18 }
  },
  c003: {
    telco: { monthlySpend: 200000, tenure: 12, dataUsage: 20 },
    eWallet: { usage: 'medium', monthlyTransactions: 25, categories: ['food', 'transport'] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 300000, categories: ['electronics', 'tools'] },
    social: { interests: ['technology', 'freelancing'], activity: 'medium', postFrequency: 9 }
  },
  c004: {
    telco: { monthlySpend: 600000, tenure: 72, dataUsage: 30 },
    eWallet: { usage: 'high', monthlyTransactions: 80, categories: ['business', 'travel', 'luxury'] },
    ecommerce: { monthlyOrders: 20, avgOrderValue: 2000000, categories: ['luxury', 'electronics', 'travel'] },
    social: { interests: ['business', 'golf', 'luxury'], activity: 'low', postFrequency: 4 }
  },
  c005: {
    telco: { monthlySpend: 250000, tenure: 24, dataUsage: 10 },
    eWallet: { usage: 'medium', monthlyTransactions: 30, categories: ['food', 'transport'] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 400000, categories: ['fashion', 'sport'] },
    social: { interests: ['sport', 'football'], activity: 'medium', postFrequency: 8 }
  },
  c006: {
    telco: { monthlySpend: 200000, tenure: 36, dataUsage: 8 },
    eWallet: { usage: 'low', monthlyTransactions: 15, categories: ['food', 'transport'] },
    ecommerce: { monthlyOrders: 4, avgOrderValue: 350000, categories: ['books', 'home'] },
    social: { interests: ['books', 'movies'], activity: 'low', postFrequency: 5 }
  },
  c007: {
    telco: { monthlySpend: 500000, tenure: 60, dataUsage: 20 },
    eWallet: { usage: 'high', monthlyTransactions: 50, categories: ['business', 'transport'] },
    ecommerce: { monthlyOrders: 10, avgOrderValue: 1500000, categories: ['electronics', 'office'] },
    social: { interests: ['business', 'investment'], activity: 'medium', postFrequency: 7 }
  },
  c008: {
    telco: { monthlySpend: 300000, tenure: 48, dataUsage: 12 },
    eWallet: { usage: 'medium', monthlyTransactions: 35, categories: ['food', 'education', 'books'] },
    ecommerce: { monthlyOrders: 7, avgOrderValue: 450000, categories: ['books', 'education', 'home'] },
    social: { interests: ['education', 'books', 'children'], activity: 'medium', postFrequency: 9 }
  },
  c009: {
    telco: { monthlySpend: 200000, tenure: 18, dataUsage: 15 },
    eWallet: { usage: 'high', monthlyTransactions: 55, categories: ['food', 'transport', 'shopping'] },
    ecommerce: { monthlyOrders: 4, avgOrderValue: 250000, categories: ['fashion', 'sport'] },
    social: { interests: ['sport', 'music', 'games'], activity: 'high', postFrequency: 17 }
  },
  c010: {
    telco: { monthlySpend: 350000, tenure: 60, dataUsage: 10 },
    eWallet: { usage: 'medium', monthlyTransactions: 30, categories: ['food', 'shopping'] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 600000, categories: ['home', 'fashion'] },
    social: { interests: ['cooking', 'home'], activity: 'low', postFrequency: 4 }
  },
  c011: {
    telco: { monthlySpend: 400000, tenure: 48, dataUsage: 8 },
    eWallet: { usage: 'low', monthlyTransactions: 20, categories: ['food', 'health'] },
    ecommerce: { monthlyOrders: 3, avgOrderValue: 800000, categories: ['health', 'books'] },
    social: { interests: ['health', 'medicine'], activity: 'low', postFrequency: 3 }
  },
  c012: {
    telco: { monthlySpend: 150000, tenure: 12, dataUsage: 25 },
    eWallet: { usage: 'high', monthlyTransactions: 40, categories: ['food', 'transport', 'fashion'] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 300000, categories: ['fashion', 'beauty'] },
    social: { interests: ['fashion', 'beauty', 'music'], activity: 'high', postFrequency: 21 }
  },
  c013: {
    telco: { monthlySpend: 500000, tenure: 72, dataUsage: 15 },
    eWallet: { usage: 'medium', monthlyTransactions: 35, categories: ['business', 'food', 'transport'] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 2500000, categories: ['electronics', 'luxury'] },
    social: { interests: ['law', 'business', 'golf'], activity: 'low', postFrequency: 4 }
  },
  c014: {
    telco: { monthlySpend: 350000, tenure: 60, dataUsage: 12 },
    eWallet: { usage: 'medium', monthlyTransactions: 40, categories: ['food', 'shopping', 'travel'] },
    ecommerce: { monthlyOrders: 10, avgOrderValue: 700000, categories: ['fashion', 'home', 'beauty'] },
    social: { interests: ['hr', 'psychology', 'self-help'], activity: 'medium', postFrequency: 8 }
  },
  c015: {
    telco: { monthlySpend: 280000, tenure: 36, dataUsage: 20 },
    eWallet: { usage: 'high', monthlyTransactions: 50, categories: ['food', 'tech', 'gaming'] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 550000, categories: ['electronics', 'gaming'] },
    social: { interests: ['technology', 'gaming', 'anime'], activity: 'high', postFrequency: 19 }
  },
  c016: {
    telco: { monthlySpend: 320000, tenure: 48, dataUsage: 8 },
    eWallet: { usage: 'medium', monthlyTransactions: 30, categories: ['food', 'health', 'family'] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 500000, categories: ['health', 'family'] },
    social: { interests: ['health', 'family'], activity: 'low', postFrequency: 5 }
  },
  c017: {
    telco: { monthlySpend: 300000, tenure: 36, dataUsage: 18 },
    eWallet: { usage: 'high', monthlyTransactions: 45, categories: ['food', 'tech', 'art'] },
    ecommerce: { monthlyOrders: 9, avgOrderValue: 650000, categories: ['electronics', 'art', 'design'] },
    social: { interests: ['design', 'art', 'photography'], activity: 'high', postFrequency: 16 }
  },
  c018: {
    telco: { monthlySpend: 700000, tenure: 96, dataUsage: 25 },
    eWallet: { usage: 'high', monthlyTransactions: 100, categories: ['business', 'travel', 'luxury'] },
    ecommerce: { monthlyOrders: 25, avgOrderValue: 3000000, categories: ['luxury', 'travel', 'business'] },
    social: { interests: ['business', 'luxury', 'travel'], activity: 'medium', postFrequency: 9 }
  },
  c019: {
    telco: { monthlySpend: 250000, tenure: 24, dataUsage: 22 },
    eWallet: { usage: 'high', monthlyTransactions: 55, categories: ['food', 'entertainment', 'tech'] },
    ecommerce: { monthlyOrders: 7, avgOrderValue: 450000, categories: ['electronics', 'camera'] },
    social: { interests: ['content', 'video', 'tech'], activity: 'high', postFrequency: 20 }
  },
  c020: {
    telco: { monthlySpend: 400000, tenure: 84, dataUsage: 10 },
    eWallet: { usage: 'medium', monthlyTransactions: 35, categories: ['business', 'food', 'transport'] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 900000, categories: ['business', 'finance'] },
    social: { interests: ['finance', 'investment', 'business'], activity: 'low', postFrequency: 4 }
  }
}

function estimateAvgTransactionValue(usage: 'low' | 'medium' | 'high', tx: number): number {
  if (usage === 'high' && tx >= 70) return 320000
  if (usage === 'high') return 220000
  if (usage === 'medium') return 160000
  return 110000
}

function toEmail(id: string): string {
  return `${id}@demo.local`
}

function toPhone(index: number): string {
  const serial = (10000000 + index).toString()
  return `09${serial}`
}

export const CUSTOMERS: Customer[] = PROFILE_SEEDS.map((seed, index) => ({
  ...seed,
  email: toEmail(seed.id),
  phone: toPhone(index),
  address: `${100 + index} Demo Street, District ${(index % 12) + 1}`,
  city: 'HCM'
}))

export const ALTERNATIVE_DATA: Record<string, AlternativeData> = Object.fromEntries(
  Object.entries(RAW_ALT_DATA).map(([id, raw]) => {
    const eWallet = {
      ...raw.eWallet,
      avgTransactionValue: estimateAvgTransactionValue(raw.eWallet.usage, raw.eWallet.monthlyTransactions)
    }

    const ecommerce = {
      ...raw.ecommerce,
      totalMonthlySpend: raw.ecommerce.monthlyOrders * raw.ecommerce.avgOrderValue
    }

    return [
      id,
      {
        telco: raw.telco,
        eWallet,
        ecommerce,
        social: raw.social
      } satisfies AlternativeData
    ]
  })
) as Record<string, AlternativeData>

export const PRODUCTS: Product[] = [
  {
    id: 'personal-loan',
    type: 'personal_loan',
    productCode: 'SF-PL-001',
    name: 'Vay tín chấp cá nhân',
    description: 'Giai ngan nhanh, khong can the chap tai san, thu tuc 100% online',
    minIncome: 8000000,
    targetSegment: ['office', 'salaried', 'stable', 'professional'],
    keyTerms: {
      limitHint: 'Han muc de xuat: len den 300M VND',
      feeHint: 'Lai suat tham khao: 18%-24%/nam tuy diem tin dung'
    },
    operationalNotes: [
      'Uu tien lead co thu nhap on dinh va thanh toan hoa don deu',
      'Can doi chieu dieu kien KYC truoc khi goi'
    ]
  },
  {
    id: 'credit-card',
    type: 'credit_card',
    productCode: 'SF-CC-001',
    name: 'Thẻ tín dụng THE FIRST',
    description: 'Rut tien mat 100% han muc, tich luy diem thuong, tra gop 0%',
    minIncome: 7000000,
    targetSegment: ['shopping', 'ecommerce', 'young', 'office'],
    keyTerms: {
      limitHint: 'Han muc de xuat: toI da 100M VND',
      feeHint: 'Mien phi nam dau neu dat dieu kien chi tieu'
    },
    operationalNotes: [
      'Phu hop lead co tan suat ecommerce va e-wallet cao',
      'Nho xac nhan nhu cau chi tieu nhom ban le'
    ]
  },
  {
    id: 'auto-loan',
    type: 'auto_loan',
    productCode: 'SF-AL-001',
    name: 'Vay mua ô tô',
    description: 'Tai tro den 80% gia tri xe moi, thoi han vay den 84 thang',
    minIncome: 20000000,
    targetSegment: ['business', 'professional', 'mid_age', 'high_income'],
    keyTerms: {
      limitHint: 'Han muc de xuat: len den 4 ty VND',
      tenorHint: 'Ky han de xuat: 12-84 thang'
    },
    operationalNotes: [
      'Uu tien lead co thu nhap cao va quan tam xe hoi',
      'Can tham dinh bo sung ho so muc dich su dung von'
    ]
  }
]

export function getEligibleProducts(income: number): Product[] {
  return PRODUCTS.filter((product) => income >= product.minIncome)
}
