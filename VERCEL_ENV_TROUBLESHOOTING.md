# Vercel Environment Variable Troubleshooting Guide

## The Problem

You're seeing 404 errors like:
- `POST https://seka-svara-2.onrender.com/auth/google/verify 404 (Not Found)`

This means the `/api/v1` prefix is missing from API calls.

## Step-by-Step Fix

### Step 1: Verify Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `seka-svara-cp`

2. **Check Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Look for `VITE_API_URL`
   - **Expected Value:** `https://seka-svara-2.onrender.com`
   - **NOT:** `https://seka-svara-2.onrender.com/api/v1` (don't include `/api/v1`)

3. **If Missing or Wrong:**
   - Click **Edit** or **Add New**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://seka-svara-2.onrender.com`
   - **Environments:** Select all (Production, Preview, Development)
   - Click **Save**

### Step 2: Clear Build Cache and Redeploy

**Option A: Clear Build Cache (Recommended)**
1. Go to **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Click **Clear Build Cache**
4. Go to **Deployments** tab
5. Click three dots (⋯) on latest deployment
6. Select **Redeploy**

**Option B: Force Rebuild with New Commit**
```bash
git commit --allow-empty -m "force: rebuild with env vars"
git push
```

### Step 3: Verify Build Logs

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Build Logs**
4. Search for `VITE_API_URL` in the logs
5. You should see it being used in the build

### Step 4: Check Browser Console After Deployment

After the new deployment completes:

1. **Open your Vercel app** in a fresh browser window (or incognito)
2. **Open DevTools Console** (F12)
3. **Look for these logs:**
   ```
   🔧 [API Config] VITE_API_URL from env: https://seka-svara-2.onrender.com
   🔧 [API Config] Final BASE_URL: https://seka-svara-2.onrender.com/api/v1
   🔧 ApiService initialized with baseURL: https://seka-svara-2.onrender.com/api/v1
   ```

4. **If you see:**
   - `VITE_API_URL from env: undefined` → Environment variable not set
   - `Final BASE_URL: http://localhost:8000/api/v1` → Using default (need rebuild)
   - `Final BASE_URL: https://seka-svara-2.onrender.com/api/v1` → ✅ Correct!

### Step 5: Test API Call

1. Try to register or login
2. Check the console for:
   ```
   🌐 API Request: {
     url: "https://seka-svara-2.onrender.com/api/v1/auth/register",
     ...
   }
   ```
3. If you see `/auth/register` without `/api/v1`, the build didn't pick up the env var

## Common Issues

### Issue 1: Environment Variable Not Being Read

**Symptoms:**
- Console shows `VITE_API_URL from env: undefined`
- API calls go to `localhost:8000`

**Solution:**
1. Verify variable is set in Vercel (Step 1)
2. Make sure it's set for **all environments** (Production, Preview, Development)
3. Clear build cache and redeploy (Step 2)

### Issue 2: Old Build Being Cached

**Symptoms:**
- Environment variable is set correctly
- But API calls still go to wrong URL

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Try incognito window
4. Clear Vercel build cache (Step 2)

### Issue 3: Wrong Environment Variable Value

**Symptoms:**
- Variable is set but has wrong value
- API calls go to wrong URL

**Solution:**
1. Check the exact value in Vercel
2. Should be: `https://seka-svara-2.onrender.com` (no trailing slash, no `/api/v1`)
3. Update if needed and redeploy

## Quick Checklist

- [ ] `VITE_API_URL` is set in Vercel
- [ ] Value is `https://seka-svara-2.onrender.com` (no `/api/v1`)
- [ ] Variable is set for all environments
- [ ] Build cache has been cleared
- [ ] New deployment completed
- [ ] Browser cache cleared (or using incognito)
- [ ] Console shows correct BASE_URL
- [ ] API requests include `/api/v1` prefix

## Still Not Working?

If after following all steps it still doesn't work:

1. **Check Vercel Build Logs:**
   - Look for any errors during build
   - Search for "VITE_API_URL" to see if it's being used

2. **Check Network Tab:**
   - Open DevTools → Network tab
   - Make an API call
   - Check the actual URL being called
   - Should be: `https://seka-svara-2.onrender.com/api/v1/...`

3. **Contact Support:**
   - Share the console logs showing the API configuration
   - Share the Network tab showing the actual request URL
   - Share the Vercel build logs

