# Google OAuth Setup for Vercel Deployment

## Problem
When deploying the frontend to Vercel, Google Sign-In fails with "Error 400: origin_mismatch" because the Vercel URL is not registered as an authorized origin in Google Cloud Console.

## Solution

### Step 1: Add Vercel URLs to Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create a new one)

2. **Navigate to OAuth 2.0 Client IDs**
   - Go to **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID (or create one if you don't have one)
   - The Client ID should be: `485100795433-qcoglhlidiih80k2ptc49g2fuv526lqo.apps.googleusercontent.com`

3. **Edit the OAuth Client**
   - Click on the OAuth 2.0 Client ID to edit it
   - Scroll down to **Authorized JavaScript origins**

4. **Add Your Vercel URLs**
   Add the following URLs (one per line):
   ```
   https://seka-svara-cp.vercel.app
   https://seka-svara-cp-*.vercel.app
   ```
   
   **Note:** The wildcard `*` allows all preview deployments (branch deployments) to work.

5. **Add Authorized Redirect URIs**
   Scroll down to **Authorized redirect URIs** and add:
   ```
   https://seka-svara-cp.vercel.app
   https://seka-svara-cp.vercel.app/login
   https://seka-svara-cp.vercel.app/register
   ```

6. **Save Changes**
   - Click **Save** at the bottom
   - Changes may take a few minutes to propagate

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `seka-svara-cp`

2. **Navigate to Settings → Environment Variables**

3. **Add Google Client ID**
   - **Key:** `VITE_GOOGLE_CLIENT_ID`
   - **Value:** `485100795433-qcoglhlidiih80k2ptc49g2fuv526lqo.apps.googleusercontent.com`
   - **Environment:** Production, Preview, Development (select all)

4. **Redeploy**
   - After adding the environment variable, go to **Deployments**
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger automatic deployment

### Step 3: Verify Configuration

1. **Check Authorized Origins**
   - In Google Cloud Console, verify that your Vercel URLs are listed
   - Make sure there are no typos (include `https://` and no trailing slashes)

2. **Test Google Sign-In**
   - Visit your Vercel deployment: `https://seka-svara-cp.vercel.app/login`
   - Click "Sign in with Google"
   - It should work without the "origin_mismatch" error

### Common Issues

**Issue:** Still getting "origin_mismatch" error
- **Solution:** Wait 5-10 minutes for Google's changes to propagate, then try again
- **Solution:** Clear browser cache and cookies
- **Solution:** Verify the exact URL matches (check for `www.` or trailing slashes)

**Issue:** Works locally but not on Vercel
- **Solution:** Make sure `VITE_GOOGLE_CLIENT_ID` is set in Vercel environment variables
- **Solution:** Verify the Vercel URL is added to Google Cloud Console

**Issue:** Preview deployments (branch deployments) don't work
- **Solution:** Add a wildcard pattern: `https://seka-svara-cp-*.vercel.app` in Authorized JavaScript origins

## Additional Notes

- **Local Development:** The app uses `http://localhost:5173` (or your dev server port) which should also be added to Google Cloud Console
- **Multiple Environments:** You may want separate OAuth clients for development and production
- **Security:** Never commit your Google Client Secret to the repository (it's not needed for frontend OAuth)

