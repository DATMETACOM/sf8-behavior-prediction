# SF8 API Documentation

## Overview

SF8 exposes REST APIs for customer behavior prediction and product recommendation. Currently using mock data and rule-based fallback until Qwen API key is available.

---

## Base URL

```
Development: http://localhost:3000
Production:  TBD
```

---

## Endpoints

### 1. Get All Customers

Get list of all customers with basic profile information.

**Request**
```http
GET /api/customers
```

**Response**
```json
{
  "customers": [
    {
      "id": "c001",
      "name": "Nguyễn Văn An",
      "age": 28,
      "income": 15000000,
      "occupation": "Kỹ sư phần mềm"
    }
  ]
}
```

---

### 2. Get Customer Detail

Get detailed information about a specific customer including alternative data.

**Request**
```http
GET /api/customers/{customerId}
```

**Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| customerId | string | Customer ID (e.g., "c001") |

**Response**
```json
{
  "customer": {
    "id": "c001",
    "name": "Nguyễn Văn An",
    "age": 28,
    "income": 15000000,
    "occupation": "Kỹ sư phần mềm"
  },
  "alternativeData": {
    "telco": {
      "monthlySpend": 300000,
      "tenure": 36,
      "dataUsage": 15
    },
    "eWallet": {
      "usage": "high",
      "monthlyTransactions": 45,
      "categories": ["food", "transport", "shopping"]
    },
    "ecommerce": {
      "monthlyOrders": 8,
      "avgOrderValue": 500000,
      "categories": ["electronics", "books"]
    },
    "social": {
      "interests": ["technology", "gaming", "travel"],
      "activity": "high"
    }
  },
  "eligibleProducts": [...]
}
```

---

### 3. Get Behavior Prediction (Qwen API)

Get AI-powered behavior prediction and product recommendation for a customer.

**Request**
```http
POST /api/predict
```

**Request Body**
```json
{
  "customerId": "c001"
}
```

**Response**
```json
{
  "customerId": "c001",
  "recommendedProduct": {
    "id": "cc-platinum",
    "name": "Thẻ tín dụng Platinum",
    "type": "credit_card",
    "minIncome": 10000000,
    "targetSegment": ["office", "it", "professional"]
  },
  "confidence": 0.85,
  "reason": "Khách hàng có 8 đơn hàng/tháng với giá trị trung bình 0.5M VNĐ. Nên giới thiệu thẻ Cashback để tối ưu ưu đãi.",
  "nextAction": "Liên hệ khách hàng để giới thiệu Thẻ tín dụng Platinum",
  "offerDetails": {
    "limit": "50M VND",
    "promo": "0% phí rút tiền 12 tháng, 500K điểm thưởng"
  }
}
```

---

## Error Responses

All endpoints may return these error codes:

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

**Error Response Format**
```json
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer with ID 'c999' not found"
  }
}
```

---

## Rate Limiting (Future)

| Endpoint | Limit |
|----------|-------|
| GET /customers | 100 req/min |
| POST /predict | 20 req/min |

---

## Qwen API Integration

### Alibaba Cloud DashScope

**Endpoint:** `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation`

**Headers:**
```http
Authorization: Bearer {QWEN_API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "model": "qwen-plus",
  "input": {
    "messages": [
      {
        "role": "system",
        "content": "You are a banking product recommendation expert..."
      },
      {
        "role": "user",
        "content": "{behavior_analysis_prompt}"
      }
    ]
  },
  "parameters": {
    "result_format": "message",
    "max_tokens": 1500
  }
}
```

**Models:**
- `qwen-plus` - Balanced (recommended)
- `qwen-max` - Highest accuracy
- `qwen-turbo` - Fastest

---

## Testing

### Mock Data
All endpoints return mock data by default. No API key required for development.

### Example cURL

```bash
# Get all customers
curl http://localhost:3000/api/customers

# Get customer detail
curl http://localhost:3000/api/customers/c001

# Get prediction
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"customerId":"c001"}'
```

---

## SDK Usage

### JavaScript/TypeScript
```typescript
import { predictBehavior } from '@/lib/qwen';
import { getCustomer, getAlternativeData } from '@/lib/data';

const customer = getCustomer("c001");
const alternativeData = getAlternativeData("c001");
const products = getEligibleProducts(customer.income);

const prediction = await predictBehavior({
  customer,
  alternativeData,
  availableProducts: products,
});

console.log(prediction.recommendedProduct.name);
console.log(prediction.confidence);
console.log(prediction.offerDetails);
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-04-13 | Initial PoC with mock data |
