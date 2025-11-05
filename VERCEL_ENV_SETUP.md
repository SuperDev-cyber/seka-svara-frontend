# Vercel Environment Variables Setup

## Required Environment Variables

To fix the Google OAuth 404 error, make sure these environment variables are set in Vercel:

### 1. VITE_API_URL

**Purpose:** Backend API base URL (without `/api/v1` suffix)

**Value:** `https://seka-svara-2.onrender.com`

**Important:** 
- Do NOT include `/api/v1` in this value
- The code will automatically append `/api/v1` to create the full API URL
- Final API URL will be: `https://seka-svara-2.onrender.com/api/v1`

### 2. VITE_GOOGLE_CLIENT_ID

**Purpose:** Google OAuth Client ID for authentication

**Value:** `485100795433-qcoglhlidiih80k2ptc49g2fuv526lqo.apps.googleusercontent.com`

## How to Set in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `seka-svara-cp`

2. **Navigate to Settings → Environment Variables**

3. **Add/Update Variables:**
   - Click **Add New**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://seka-svara-2.onrender.com`
   - **Environments:** Select all (Production, Preview, Development)
   - Click **Save**

   - Click **Add New** again
   - **Key:** `VITE_GOOGLE_CLIENT_ID`
   - **Value:** `485100795433-qcoglhlidiih80k2ptc49g2fuv526lqo.apps.googleusercontent.com`
   - **Environments:** Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger automatic deployment

## Verification

After redeploying, check the browser console:
- The API requests should go to: `https://seka-svara-2.onrender.com/api/v1/auth/google/verify`
- Not: `https://seka-svara-2.onrender.com/auth/google/verify` (this would be wrong)

## Troubleshooting

**Issue:** Still getting 404 errors
- **Solution:** Verify `VITE_API_URL` is set to `https://seka-svara-2.onrender.com` (without trailing slash, without `/api/v1`)
- **Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- **Solution:** Check Vercel deployment logs to ensure environment variables are being injected

**Issue:** API calls go to wrong URL
- **Solution:** Check browser DevTools → Network tab to see the actual URL being called
- **Solution:** Verify the `BASE_URL` in browser console by logging `API_CONFIG.BASE_URL`

