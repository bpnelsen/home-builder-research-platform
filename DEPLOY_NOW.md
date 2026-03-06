# 🚀 ONE-CLICK DEPLOYMENT GUIDE

## The Absolute Easiest Way to Get Home Builder Live

You have 2 options:

---

## OPTION 1: Automated Script (If You Have Vercel Token)

```bash
# Set your Vercel token
export VERCEL_TOKEN="your-token-here"

# Run this script
vercel env add NEXT_PUBLIC_SUPABASE_URL https://rrpkokhjomvlumreknuq.supabase.co --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY sb_publishable_L7gJaRj4UpH8UtsyC0GDHQ_6MV10N4u --token $VERCEL_TOKEN
vercel env add SUPABASE_SERVICE_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycGtva2hqb212bHVtcmVrbnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwOTU5MSwiZXhwIjoyMDg3NDg1NTkxfQ.kFTdS-I7SnPPkgqYu0amlzLQgnGJppb4ZKkfIyCy0JA --token $VERCEL_TOKEN

# Redeploy
vercel deploy --prod --token $VERCEL_TOKEN
```

---

## OPTION 2: Manual (No Token Needed - Takes 3 Minutes)

### Step 1: Add Environment Variables
1. Go to: https://vercel.com
2. Login with your account
3. Click **homebuilder** project
4. Click **Settings** tab
5. Click **Environment Variables**
6. Click **Add New** and add each one:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://rrpkokhjomvlumreknuq.supabase.co
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_L7gJaRj4UpH8UtsyC0GDHQ_6MV10N4u
```

**Variable 3:**
```
Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycGtva2hqb212bHVtcmVrbnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwOTU5MSwiZXhwIjoyMDg3NDg1NTkxfQ.kFTdS-I7SnPPkgqYu0amlzLQgnGJppb4ZKkfIyCy0JA
```

⚠️ **IMPORTANT:** Make sure each is set to **All Environments** (Production, Preview, Development)

### Step 2: Redeploy
1. Click **Deployments** tab
2. Find the latest deployment (commit starting with `07bafb73`)
3. Click **...** (three dots)
4. Click **Redeploy**
5. Wait for ✅ **Ready** (2-3 minutes)

### Step 3: Verify
1. Go to: https://homebuilder.vercel.app
2. Clear browser cache: **Ctrl+Shift+Delete**
3. Hard refresh: **Ctrl+Shift+R**

### Step 4: Celebrate! 🎉
You should see:
- ✅ Navy/Teal gradient header
- ✅ "Research Home Builders" title
- ✅ Professional design with spacing
- ✅ "All Builders (10)" section
- ✅ 10 beautiful builder cards
- ✅ Stock prices, market caps, geographic markets
- ✅ Search bar and footer with features

---

## What's Already Done (No Action Needed)

✅ TypeScript Tailwind config (`tailwind.config.ts`)  
✅ All 261 Navy/Teal color references fixed  
✅ 10 builders in Supabase database  
✅ 10 stock prices loaded  
✅ 5 pages built and tested  
✅ Professional design applied  
✅ Code pushed to GitHub  
✅ Production build verified  

---

## Troubleshooting

**Problem: Still showing "0 builders"**
- Make sure env vars are set for ALL Environments
- Hard refresh with cache clear
- Check Supabase → Table: `builders` has 10 rows

**Problem: No Navy/Teal colors**
- Vercel build might still be in progress
- Wait 5 minutes
- Hard refresh
- Clear all cookies for the domain

**Problem: Can't see changes after redeploy**
- Open in incognito window (no cache)
- Clear browser cache completely
- Try different browser

---

## Questions?

Check `VERCEL_SETUP_CHECKLIST.md` for detailed troubleshooting.

---

**You're 3 steps away from going live!** 🚀
