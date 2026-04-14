# SF8 Demo Guide

> Hướng dẫn demo SF8 - Customer Behavior Prediction cho Shinhan InnoBoost

---

## 📋 Demo Checklist

- [ ] Laptop đã cài Node.js 18+
- [ ] Code đã clone từ GitHub
- [ ] Dependencies đã install (`npm install`)
- [ ] Server đang chạy (`npm run dev`)
- [ ] Browser mở http://localhost:3000

---

## 🎬 Demo Script (3 phút)

### Opening (20 seconds)

```
"Xin chào ban giám khảo và các anh chị.

Mình là [Tên] từ đội [Tên đội]. Hôm nay mình xin trình bày
SF8 - Hệ thống phân tích hành vi khách hàng mới bằng Qwen AI."
```

### Problem Statement (30 seconds)

```
"Vấn đề chúng tôi giải quyết:

Khách hàng mới của Shinhan Finance không có lịch sử giao dịch.
Chúng ta không biết:
- Sản phẩm nào phù hợp với họ?
- Offer nào sẽ hấp dẫn?
- Liệu họ có khả năng trả nợ không?

Chúng ta có dữ liệu nhưng bị phân tán:
- Chi tiêu viễn thông
- Sử dụng e-wallet
- Lịch sử mua sắm online
- Sở thích trên mạng xã hội

Chúng tôi có giải pháp:"
```

### Solution Overview (30 seconds)

```
"SF8 - Hệ thống phân tích hành vi khách hàng bằng Qwen AI:

1. Alternative Data Scoring - Đánh giá từ đa nguồn
2. Next Product Prediction - Dự đoán sản phẩm tiếp theo
3. Personalized Offer - Offer cá nhân hóa theo hành vi
4. Real-time Recommendation - Gợi ý tức thì"
```

### Live Demo (90 seconds)

```
"Mời các anh chị cùng xem demo."
```

#### Screen 1: Customer List (30s)
```
"Đây là danh sách 20 khách hàng mẫu:

Chúng ta thấy thông tin cơ bản:
- Họ tên, tuổi, nghề nghiệp
- Thu nhập hàng tháng

Ví dụ: Nguyễn Văn An, 28 tuổi, Kỹ sư phần mềm, 15M/tháng"
```

#### Screen 2: Customer Alternative Data (30s)
```
"Chọn Nguyễn Văn An - đây là khách hàng mới.

Hệ thống đã thu thập được:
📱 Viễn thông: 300K/tháng, 36 tháng thâm niên
💳 E-wallet: Dùng cao, 45 giao dịch/tháng (food, transport, shopping)
🛒 E-commerce: 8 đơn/tháng, giá trị TB 500K (electronics, books)
👥 Social: Interested in technology, gaming, travel

Đây là 'alternative data' - dữ liệu không phải từ ngân hàng nhưng rất có giá trị."
```

#### Screen 3: AI Recommendation (30s)
```
"Dựa trên alternative data, Qwen AI phân tích và đề xuất:

🤖 Đề xuất: Thẻ tín dụng Platinum
📊 Độ tin cậy: 85% (Cao)
💡 Lý do: Khách hàng trẻ, quan tâm công nghệ, chi tiêu e-wallet cao

🎁 Offer cá nhân hóa:
- Hạn mức: 50M VND
- Promo: 0% phí rút tiền 12 tháng + 500K điểm thưởng
➡️ Hành động: Liên hệ khách hàng để giới thiệu thẻ"
```

---

## 🤖 Qwen AI Integration

```
"Tất cả phân tích được cung cấp bởi Qwen AI - mô hình ngôn ngữ lớn
của Alibaba Cloud.

Qwen phân tích:
- Telco spending + tenure → ổn định tài chính
- E-wallet usage + transactions → hành vi thanh toán
- E-commerce orders + value → nhu cầu mua sắm
- Social interests → phong cách sống

Và trả về đề xuất sản phẩm với confidence score."
```

---

## 📊 Kết quả mong đợi

| Chỉ số | Trước | Sau (dự kiến) |
|--------|-------|----------------|
| Conversion rate | 5% | 15% |
| Cross-sell success | 10% | 30% |
| Time to offer | 3-5 ngày | Real-time |
| Offer relevance | 40% | 80% |

---

## 💬 Q&A Preparation

### Câu hỏi có thể gặp

**Q: Dữ liệu từ đâu có?**
A: Hiện tại dùng mock data với 20 khách hàng mẫu. Alternative data
   được mô phỏng dựa trên patterns thực tế từ telco, e-wallet, ecommerce providers.
   Khi production sẽ kết nối với các data partner.

**Q: Tại sao dùng Qwen?**
A: Qwen có khả năng:
   - Hiểu tiếng Việt tốt
   - Xử lý context dài (nhiều nguồn dữ liệu)
   - Deploy được on-premise (điều kiện bắt buộc của ngân hàng)

**Q: Quy tắc fallback như thế nào?**
A: Khi Qwen API không available, hệ thống dùng rule-based matching:
   - High e-commerce → Cashback Card
   - Tech interest + young → Platinum Card
   - Business interest → SME Loan
   - Health/family → Insurance

**Q: Data privacy?**
A:
   - Alternative data được ẩn danh
   - Chỉ dùng aggregate patterns
   - Không lưu thông tin nhạy cảm
   - Tuân thủ PDPA

**Q: Scaling thế nào?**
A:
   - On-premise deployment (Shinhan Data Center)
   - Batch processing cho volume lớn
   - API-first design dễ integrate

---

## 🎯 Tips Demo

| Tip | Description |
|-----|-------------|
| **Don't apologize** | Đừng nói "xin lỗi nếu có lỗi" |
| **Show, don't tell** | Demo > Slide |
| **Focus on value** | Business value > Technical details |
| **Have backup** | Chuẩn bị screenshot nếu demo lỗi |
| **Practice** | Tập ít nhất 3 lần trước ngày pitch |

---

## 🔧 Troubleshooting

### Server không chạy
```bash
cd sf8-behavior-prediction
npm install
npm run dev
```

### Port 3000 đang dùng
```bash
PORT=3001 npm run dev
```

### Lỗi import
```bash
rm -rf .next node_modules
npm install
```

---

## 📞 Liên hệ

- **GitHub:** https://github.com/DATMETACOM/kts-qwen-ai
- **Email:** noreply@datmetacom.com

---

**Good luck with your demo! 🚀**
