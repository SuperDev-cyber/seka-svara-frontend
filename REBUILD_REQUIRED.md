# Important: Rebuild Required After Environment Variable Changes

## Why This Is Needed

Vite environment variables (those starting with `VITE_`) are **baked into the JavaScript bundle at build time**. This means:

- ✅ If you set `VITE_API_URL` in Vercel, it will be included in the build
- ❌ If you change `VITE_API_URL` after a build, the old value remains in the bundle
- 🔄 You **MUST rebuild/redeploy** for the new value to take effect

## How to Force a Rebuild in Vercel

### Option 1: Redeploy (Recommended)
1. Go to Vercel Dashboard → Your Project
2. Go to **Deployments** tab
3. Click the three dots (⋯) on the latest deployment
4. Select **Redeploy**
5. This will rebuild with the current environment variables

### Option 2: Push a New Commit
1. Make a small change (like adding a comment)
2. Commit and push:
   ```bash
   git commit --allow-empty -m "trigger: rebuild with updated env vars"
   git push
   ```
3. Vercel will automatically rebuild with the latest environment variables

### Option 3: Clear Build Cache
1. Go to Vercel Dashboard → Your Project → Settings
2. Go to **General** → **Build & Development Settings**
3. Click **Clear Build Cache**
4. Then redeploy

## How to Verify Environment Variables Are Being Used

After redeploying, check the browser console. You should see:

```
🔧 API Configuration: {
  VITE_API_URL: "https://seka-svara-2.onrender.com",
  API_BASE_URL: "https://seka-svara-2.onrender.com/api/v1",
  ...
}
```

If you see:
- `VITE_API_URL: undefined` → Environment variable not set
- `API_BASE_URL: "http://localhost:8000/api/v1"` → Using default (need to rebuild)
- `API_BASE_URL: "https://seka-svara-2.onrender.com/api/v1"` → ✅ Correct!

## Current Status Check

To verify your current setup:

1. **Check Vercel Environment Variables:**
   - Go to Settings → Environment Variables
   - Verify `VITE_API_URL` = `https://seka-svara-2.onrender.com`
   - Verify `VITE_GOOGLE_CLIENT_ID` is set

2. **Check Latest Deployment:**
   - Go to Deployments tab
   - Look at the latest deployment's build logs
   - Search for "VITE_API_URL" to see if it was included in the build

3. **Check Browser Console:**
   - Open your Vercel deployment
   - Open DevTools Console
   - Look for the "🔧 API Configuration" log
   - Verify the values are correct

## Troubleshooting

**Problem:** Environment variable is set but not being used
- **Solution:** The app was built before the variable was set. Redeploy to rebuild.

**Problem:** Changed environment variable but still seeing old value
- **Solution:** Clear browser cache (Ctrl+Shift+R) and verify the deployment was rebuilt

**Problem:** API calls still going to wrong URL
- **Solution:** Check browser console logs to see what URL is actually being used
- **Solution:** Verify the build logs show the environment variable was included

