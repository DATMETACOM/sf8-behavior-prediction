# SB10 - Branch Traffic Prediction & Smart Queue Management

> **PoC for Shinhan Bank InnoBoost 2026**

---

## 🎯 Problem

Khách hàng đến chi nhánh không biết trước thời gian chờ, dẫn đến:
- Đợi lâu (trung bình 20-30 phút)
- Khung giờ đông đúc (11am-1pm)
- Không tối ưu nhân sự

---

## 💡 Solution

Hệ thống dự đoán lưu lượng chi nhánh bằng Qwen AI:
- **Dự báo theo giờ** - Biết trước khi nào đông
- **"Best time to visit"** - Khuyến nghị giờ vàng
- **Real-time queue** - Cập nhật khi có check-in mới
- **Staff optimization** - Gợi ý nhân sự cho manager

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 📁 Project Structure

```
sb10-branch-prediction/
├── app/
│   ├── page.tsx          # Dashboard - Branch list
│   ├── branches/
│   │   └── [id]/
│   │       └── page.tsx  # Branch detail + Forecast
│   └── api/
│       └── predict/
│           └── [branchId]/
│               └── route.ts  # Qwen API endpoint
├── components/
│   ├── branch-card.tsx
│   ├── forecast-chart.tsx
│   └── queue-display.tsx
├── lib/
│   ├── qwen.ts           # Qwen API client
│   └── data.ts           # Mock data generator
└── types/
    └── index.ts          # TypeScript interfaces
```

---

## 🤖 Qwen Integration

```typescript
// Qwen prediction call
const prediction = await qwen.predict({
  branch: "Quận Tân Bình",
  history: trafficData,
  targetDate: "2026-04-12"
});

// Response
{
  hourly: [
    { hour: 9, customers: 5, waitTime: 8, level: "low" },
    { hour: 11, customers: 25, waitTime: 35, level: "high" },
    { hour: 14, customers: 12, waitTime: 15, level: "medium" }
  ],
  bestTime: "9:00 AM or 3:00 PM"
}
```

---

## 📊 Demo Data

5 branches in HCMC, 30 days history (~3,600 records)

---

## 🎨 Demo Flow (3 minutes)

1. **Dashboard** - Show 5 branches with status
2. **Branch Detail** - Click "Quận Tân Bình"
3. **Forecast Chart** - Show hourly prediction
4. **Best Time** - Highlight recommended hours
5. **Check-in Simulation** - Add check-in → Update prediction

---

**Track:** Financial Services (Shinhan Bank)
**InnoBoost Deadline:** 3/5/2026
