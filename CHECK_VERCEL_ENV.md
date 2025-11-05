# Quick Check: Is VITE_API_URL Set in Vercel?

## Step 1: Check Console Logs

After the latest deployment, open your Vercel app and check the browser console. You should see:

```
🔧 [API Config] VITE_API_URL from env: https://seka-svara-2.onrender.com
🔧 [API Config] Final BASE_URL: https://seka-svara-2.onrender.com/api/v1
```

**If you see:**
- `VITE_API_URL from env: undefined` → Environment variable NOT set in Vercel
- `Final BASE_URL: http://localhost:8000/api/v1` → Using default, need to set env var
- `Final BASE_URL: https://seka-svara-2.onrender.com/api/v1` → ✅ Correct!

## Step 2: Check Network Tab

1. Open DevTools → **Network** tab
2. Try to login/register
3. Look for the API request (should be `verify` or `register`)
4. Click on it and check the **Request URL**:
   - ❌ Wrong: `https://seka-svara-2.onrender.com/auth/google/verify`
   - ✅ Correct: `https://seka-svara-2.onrender.com/api/v1/auth/google/verify`

## Step 3: Verify Environment Variable in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Look for `VITE_API_URL`
3. **Value should be:** `https://seka-svara-2.onrender.com` (no `/api/v1`, no trailing slash)
4. **Environments:** Should be checked for Production, Preview, Development

## Step 4: Check Build Logs

1. Go to Vercel Dashboard → **Deployments** tab
2. Click on the latest deployment
3. Click **Build Logs**
4. Search for `VITE_API_URL` in the logs
5. You should see it being used during the build

## If Environment Variable is Missing

1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. **Key:** `VITE_API_URL`
4. **Value:** `https://seka-svara-2.onrender.com`
5. **Environments:** Select all (Production, Preview, Development)
6. Click **Save**
7. **Clear Build Cache** (Settings → General → Build & Development Settings → Clear Build Cache)
8. **Redeploy** (Deployments → Latest deployment → ⋯ → Redeploy)

