# Vercel Deployment Setup Guide

## ⚠️ Critical: Backend URL Configuration

**You MUST configure the backend URL in Vercel for the application to work!**

## Step-by-Step Instructions

### 1. Deploy Backend First

✅ **Backend is already deployed at:** `https://sui-backend-ai-platform.vercel.app`

Before deploying the frontend, make sure your backend is deployed and accessible:
- Deploy backend to Vercel, Railway, Render, or any other hosting service
- Note the backend URL (e.g., `https://your-backend.vercel.app`)

**Current Backend Status:** ✅ Running at https://sui-backend-ai-platform.vercel.app

### 2. Set Environment Variables in Vercel

1. Go to your **Vercel Dashboard**
2. Select your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** and add the following:

#### Required Variable:

```
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://sui-backend-ai-platform.vercel.app
```

**Important Notes:**
- ✅ Use `https://` (not `http://`)
- ✅ Do NOT include trailing slash (`/`)
- ✅ **Current Backend URL:** `https://sui-backend-ai-platform.vercel.app`
- ❌ Do NOT use `localhost:8000` in production

#### Optional Variables:

```
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_API_ENDPOINT=https://walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

### 3. Redeploy Application

After setting environment variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeploy

### 4. Verify Configuration

After deployment, check the browser console for any errors. If you see:
- ❌ "Backend URL is not configured" → Environment variable not set correctly
- ❌ "Cannot connect to backend" → Backend URL is incorrect or backend is not running

## Common Issues

### Issue: "Cannot connect to backend at http://localhost:8000"

**Cause:** `NEXT_PUBLIC_BACKEND_URL` is not set in Vercel

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add `NEXT_PUBLIC_BACKEND_URL` with your backend URL
3. Redeploy the application

### Issue: CORS Errors

**Cause:** Backend is not configured to accept requests from frontend domain

**Solution:** Update backend CORS settings to include your Vercel frontend URL

### Issue: Backend URL has trailing slash

**Cause:** Environment variable includes `/` at the end

**Solution:** Remove trailing slash from `NEXT_PUBLIC_BACKEND_URL`

## Example Configuration

### ✅ Current Production Configuration (Vercel):
```
NEXT_PUBLIC_BACKEND_URL=https://sui-backend-ai-platform.vercel.app
```

### Frontend URL:
```
https://sui-frontend-ai-platform.vercel.app
```

### If Backend is on Railway:
```
NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app
```

### If Backend is on Custom Domain:
```
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

## Testing Locally

For local development, create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_API_ENDPOINT=https://walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
```

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs
2. Check browser console for error messages
3. Verify backend is accessible by visiting the backend URL directly
4. Ensure backend CORS is configured correctly

