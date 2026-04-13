# SF8 - Customer Behavior Prediction

> **PoC for Shinhan Finance InnoBoost 2026**

---

## 🎯 Problem

Dữ liệu khách hàng mới phân tán, khó dự đoán nhu cầu:
- Không có lịch sử giao dịch tại Shinhan
- Dữ liệu rời rạc (telco, e-wallet, social...)
- Không biết offer nào phù hợp

---

## 💡 Solution

AI phân tích hành vi khách hàng mới từ đa nguồn dữ liệu:
- **Alternative scoring** - Dùng data bên ngoài
- **Next product prediction** - Khách cần gì tiếp theo?
- **Personalized offer** - Offer đúng người, đúng lúc

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

## 🤖 Qwen Integration

```typescript
// Analyze customer behavior
const prediction = await qwen.predictBehavior({
  customer: {
    telco_spending: 500000,
    e_wallet_usage: "high",
    ecommerce_orders: 15,
    social_interests: ["travel", "shopping"]
  },
  available_products: ["credit_card", "personal_loan", "insurance"]
});

// Response
{
  recommended: "credit_card",
  confidence: 0.85,
  reason: "High e-commerce activity + travel interest",
  offer_details: {
    limit: "20M",
    promo: "0% fee for 3 months"
  }
}
```

---

## 📊 Demo Data

- 20 sample customers với alternative data
- 5 Shinhan Finance products
- Behavior patterns & rules

---

## 🎨 Demo Flow (3 minutes)

1. **Customer List** - Show 20 customers
2. **Customer Detail** - Click để xem behavior analysis
3. **AI Recommendation** - Qwen suggest product
4. **Offer Preview** - Show personalized offer

---

**Track:** Financial Services (Shinhan Finance)
**InnoBoost Deadline:** 3/5/2026
