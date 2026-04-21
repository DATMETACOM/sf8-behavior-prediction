import { beforeEach, describe, expect, it } from 'vitest'
import handler from '../api/copilot-query.js'

function createMockRes() {
  const result: { statusCode: number; body: any; status: (code: number) => any; json: (payload: any) => any } = {
    statusCode: 200,
    body: null,
    status(code: number) {
      result.statusCode = code
      return result
    },
    json(payload: any) {
      result.body = payload
      return result
    }
  }
  return result
}

const contextFixture = {
  generatedAt: '2026-04-15T00:00:00.000Z',
  stats: {
    total: 20,
    avgScore: 71,
    maxScore: 89,
    minScore: 42,
    pushNow: 9,
    nurture: 8,
    hold: 3
  },
  selectedCustomerId: 'c001',
  customers: [
    {
      id: 'c001',
      name: 'Nguyen Van An',
      age: 28,
      income: 15000000,
      occupation: 'Software Engineer',
      overallScore: 78,
      action: 'push now',
      confidence: 0.81,
      recommendedProduct: 'personal-loan',
      positiveFactors: ['High e-wallet activity', 'Strong e-commerce purchase behavior'],
      negativeFactors: ['Low commerce activity']
    }
  ],
  productCatalog: [
    {
      id: 'personal-loan',
      productCode: 'SF-PL-001',
      name: 'Vay tín chấp cá nhân',
      minIncome: 8000000,
      description: 'Giai ngan nhanh, khong can the chap tai san, thu tuc 100% online'
    },
    {
      id: 'credit-card',
      productCode: 'SF-CC-001',
      name: 'Thẻ tín dụng THE FIRST',
      minIncome: 7000000,
      description: 'Rut tien mat 100% han muc, tich luy diem thuong, tra gop 0%'
    },
    {
      id: 'auto-loan',
      productCode: 'SF-AL-001',
      name: 'Vay mua ô tô',
      minIncome: 20000000,
      description: 'Tai tro den 80% gia tri xe moi, thoi han vay den 84 thang'
    }
  ]
}

describe('copilot api contract', () => {
  beforeEach(() => {
    delete process.env.DASHSCOPE_API_KEY
  })

  it('rejects non-POST method', async () => {
    const req = { method: 'GET', body: {} }
    const res = createMockRes()
    await handler(req, res)

    expect(res.statusCode).toBe(405)
    expect(res.body.error).toBe('Method not allowed')
  })

  it('blocks mutation-like requests with read-only advisory', async () => {
    const req = {
      method: 'POST',
      body: {
        question: 'Hay xoa du lieu khach c001',
        context: contextFixture
      }
    }
    const res = createMockRes()
    await handler(req, res)

    expect(res.statusCode).toBe(200)
    expect(res.body.intent).toBe('unsupported')
    expect(String(res.body.answer).toLowerCase()).toContain('ai chi dong vai tro khuyen nghi')
    expect(res.body.source).toBe('fallback')
  })

  it('returns portfolio stats with evidence fields', async () => {
    const req = {
      method: 'POST',
      body: {
        question: 'Cho toi thong ke tong quan danh muc',
        context: contextFixture
      }
    }
    const res = createMockRes()
    await handler(req, res)

    expect(res.statusCode).toBe(200)
    expect(res.body.intent).toBe('portfolio_stats')
    expect(res.body.evidence.length).toBeGreaterThan(0)
    expect(res.body.riskFlag).toBe('ok')
    expect(res.body.source).toBe('fallback')
  })
})
