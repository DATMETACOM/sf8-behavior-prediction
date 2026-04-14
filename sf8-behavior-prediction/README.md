# SF8 - Customer Behavior Prediction

> **AI-powered Customer Behavior Analysis for Shinhan Finance**
> PoC for Shinhan InnoBoost 2026

---

## 🎯 Problem Statement

Dữ liệu khách hàng mới phân tán, khó dự đoán nhu cầu:
- Không có lịch sử giao dịch tại Shinhan
- Dữ liệu rời rạc (telco, e-wallet, social...)
- Không biết offer nào phù hợp
- Conversion rate thấp (5-10%)

---

## 💡 Solution

AI phân tích hành vi khách hàng mới từ đa nguồn dữ liệu:
- **Alternative Data Scoring** - Dùng telco, e-wallet, ecommerce, social data
- **Next Product Prediction** - Khách cần gì tiếp theo?
- **Personalized Offer** - Offer đúng người, đúng lúc
- **Real-time Recommendation** - Gợi ý tức thì

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## ✨ Features

### 1. Customer Dashboard
- List view của 20 khách hàng mẫu
- Profile summary: age, income, occupation
- Click để xem chi tiết

### 2. Customer Detail View
- **Hồ sơ khách hàng**: Thông tin cơ bản, thu nhập
- **Alternative Data**:
  - 📱 Telco: Chi tiêu, thâm niên, data usage
  - 💳 E-Wallet: Usage level, transactions, categories
  - 🛒 E-commerce: Orders, value, categories
  - 👥 Social: Interests, activity level

### 3. AI Recommendation
- Product recommendation từ Qwen AI
- Confidence score (Cao/Trung bình/Thấp)
- Lý do đề xuất (dựa trên behavior analysis)
- Personalized offer details

---

## 🤖 Qwen Integration

```typescript
// Analyze customer behavior
const prediction = await qwen.predictBehavior({
  customer: {
    name: "Nguyễn Văn An",
    age: 28,
    income: 15000000,
    occupation: "Kỹ sư phần mềm"
  },
  alternativeData: {
    telco: { monthlySpend: 300000, tenure: 36, dataUsage: 15 },
    eWallet: { usage: "high", monthlyTransactions: 45, categories: ["food", "shopping"] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 500000, categories: ["electronics"] },
    social: { interests: ["technology", "gaming"], activity: "high" }
  },
  availableProducts: [...]
});

// Response
{
  recommendedProduct: { name: "Thẻ tín dụng Platinum", type: "credit_card" },
  confidence: 0.85,
  reason: "Khách hàng có 8 đơn hàng/tháng...",
  nextAction: "Liên hệ khách hàng...",
  offerDetails: { limit: "50M VND", promo: "0% phí rút tiền 12 tháng" }
}
```

---

## 📊 Data Structure

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  age: number;
  income: number;
  occupation: string;
}
```

### Alternative Data
```typescript
interface AlternativeData {
  telco: { monthlySpend: number; tenure: number; dataUsage: number };
  eWallet: { usage: "low" | "medium" | "high"; monthlyTransactions: number; categories: string[] };
  ecommerce: { monthlyOrders: number; avgOrderValue: number; categories: string[] };
  social: { interests: string[]; activity: "low" | "medium" | "high" };
}
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 14 App                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │CustomerList│  │CustomerView│  │  AI Recommendation │   │
│  └─────┬──────┘  └─────┬──────┘  └──────────┬─────────┘   │
│        └────────────────┴────────────────────┘            │
└──────────────────────────────┬─────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Data Layer        │
                    │  - 20 Customers     │
                    │  - Alt Data         │
                    │  - 7 Products       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Qwen API Layer   │ (TBD)
                    │  - Prompt Builder  │
                    │  - Rule Fallback   │
                    └─────────────────────┘
```

---

## 🎨 Demo Flow (3 minutes)

1. **Customer List** - Show 20 customers với basic info
2. **Customer Detail** - Click để xem behavior analysis
3. **Alternative Data** - Show telco, e-wallet, ecommerce, social data
4. **AI Recommendation** - Qwen suggest product với confidence & offer

---

## 📁 Project Structure

```
sf8-behavior-prediction/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Customer list dashboard
│   │   ├── customers/[id]/page.tsx  # Customer detail
│   │   └── api/                  # API routes
│   ├── lib/
│   │   ├── data.ts               # Mock data
│   │   └── qwen.ts               # Qwen client
│   └── types/
│       └── index.ts              # TypeScript types
├── README.md
├── ARCHITECTURE.md
├── API.md
└── DEMO.md
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Qwen (Alibaba Cloud)

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API.md](./API.md) - API endpoints
- [DEMO.md](./DEMO.md) - Demo script

---

## 🚧 Roadmap

- [ ] Integrate Qwen API (pending API key)
- [ ] Add real-time data updates
- [ ] Implement customer segmentation
- [ ] Add batch prediction for all customers
- [ ] Create admin dashboard for offers management

---

**Track:** Financial Services (Shinhan Finance)
**InnoBoost Deadline:** 3/5/2026
**GitHub:** https://github.com/DATMETACOM/kts-qwen-ai
