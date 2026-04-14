# 🚀 Quick Deploy - SF8 Behavior Prediction

> **Thời gian**: 5 phút (Phase 1)
> **Chi phí**: FREE
> **Result**: Live URL cho judges

---

## Phase 1: Deploy lên Vercel (5 phút)

### Bước 1: Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### Bước 2: Deploy

```bash
# Navigate to SF8 folder
cd sf8-behavior-prediction

# Deploy (lần đầu)
vercel

# Follow prompts:
# ? Set up and deploy? → Y
# ? Which scope? → Select your account
# ? Link to existing project? → N
# ? Project name? → sf8-behavior-prediction
# ? Directory? → ./
# ? Override settings? → N

# Production deploy
vercel --prod
```

### Bước 3: Get URL

```bash
vercel ls
```

**Output**:
```
https://sf8-behavior-prediction-xxxx.vercel.app
```

### Bước 4: Test

Mở trình duyệt → Paste URL → Verify:
- ✅ Dashboard loads
- ✅ Customer detail works
- ✅ Simulation works
- ✅ Export works

---

## Phase 2: Thêm Supabase (2-3 giờ)

### Bước 1: Tạo Supabase Project

1. https://supabase.com/dashboard → New Project
2. Region: Singapore
3. Copy credentials:
   - Project URL
   - Anon Key

### Bước 2: Chạy Migration

```bash
# Copy SQL từ: supabase/migrations/001_initial_schema.sql
# Paste vào: Supabase Dashboard → SQL Editor → Run
```

### Bước 3: Add Environment Variables

**Vercel Dashboard** → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### Bước 4: Deploy lại

```bash
vercel --prod
```

---

## Phase 3: Production (2-4 tuần)

Xem chi tiết trong: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build fails** | Check `vercel.json` exists |
| **404 on routes** | Verify `rewrites` in vercel.json |
| **Qwen not working** | Add DASHSCOPE_API_KEY to Vercel |
| **Supabase error** | Check VITE_SUPABASE_* env vars |

---

## Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repo**: https://github.com/DATMETACOM/kts-qwen-ai

---

**Done! 🎉**
