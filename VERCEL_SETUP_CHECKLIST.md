# Vercel Setup Checklist for Home Builder Research Platform

## ✅ Required Environment Variables

Go to: https://vercel.com → **homebuilder** → **Settings** → **Environment Variables**

Add these EXACTLY (copy-paste):

### Variable 1: Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://rrpkokhjomvlumreknuq.supabase.co
Environments: All (Production, Preview, Development)
```

### Variable 2: Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_L7gJaRj4UpH8UtsyC0GDHQ_6MV10N4u
Environments: All (Production, Preview, Development)
```

### Variable 3: Supabase Service Key
```
Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycGtva2hqb212bHVtcmVrbnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwOTU5MSwiZXhwIjoyMDg3NDg1NTkxfQ.kFTdS-I7SnPPkgqYu0amlzLQgnGJppb4ZKkfIyCy0JA
Environments: All (Production, Preview, Development)
```

---

## ✅ Deployment Checklist

- [ ] **Step 1:** Add all 3 environment variables to Vercel
- [ ] **Step 2:** Go to **Deployments** tab
- [ ] **Step 3:** Click **...** on latest deployment (commit 03fb07c6)
- [ ] **Step 4:** Click **Redeploy**
- [ ] **Step 5:** Wait for ✅ **Ready** status (2-3 minutes)
- [ ] **Step 6:** Go to https://homebuilder.vercel.app
- [ ] **Step 7:** Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- [ ] **Step 8:** Clear browser cache: **Ctrl+Shift+Delete** before refreshing

---

## ✅ What You Should See After Refresh

✅ Navy/Teal colors (not plain text)
✅ "Research Home Builders" headline in gradient
✅ "0" builders stats with Navy/Teal styling
✅ Search bar with professional design
✅ "All Builders (10)" section header
✅ 10 builder cards displayed (LEN, DHI, KBH, TOL, PHM, NVR, TPH, MDC, CVCO, LGIH)
✅ Each card showing stock price, market cap, markets
✅ Professional footer with features and data sources

---

## ✅ If It Still Doesn't Work

1. **Double-check environment variables** - Make sure they're set for ALL environments
2. **Verify Vercel deployment** - Make sure latest is ✅ Ready (not Building/Failed)
3. **Check Supabase** - Login to supabase.com, verify `builders` table has 10 records
4. **Clear all cache** - Delete cookies/cache for homebuilder.vercel.app
5. **Try incognito** - Open in private window (avoids all cache)

---

## Latest Commit

Commit: **03fb07c6**
Message: "Remove duplicate tailwind.config.js - use TypeScript config only for Vercel compilation"
Build Status: ✅ PASSING

---

## Contact Points

- **Database:** supabase.com (rrpkokhjomvlumreknuq)
- **Deployment:** vercel.com (homebuilder)
- **Code:** github.com/bpnelsen/home-builder-research-platform
- **Live URL:** https://homebuilder.vercel.app
