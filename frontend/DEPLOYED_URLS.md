# Deployed Application URLs

## 🌐 Production URLs

### Frontend
**URL:** https://sui-frontend-ai-platform.vercel.app/

### Backend API
**URL:** https://sui-backend-ai-platform.vercel.app/

**Status:** ✅ Running
```json
{
  "message": "Sui-DAT Backend API",
  "version": "1.0.0",
  "status": "running",
  "description": "Decentralized AI Training Platform"
}
```

## 🔧 Environment Variable Configuration

To connect the frontend to the backend, set this environment variable in Vercel:

```
NEXT_PUBLIC_BACKEND_URL=https://sui-backend-ai-platform.vercel.app
```

### Steps to Configure:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **frontend project** (`sui-frontend-ai-platform`)
3. Navigate to **Settings** → **Environment Variables**
4. Add or update:
   - **Name:** `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** `https://sui-backend-ai-platform.vercel.app`
5. **Redeploy** the frontend application

## ✅ Verification

After setting the environment variable and redeploying:

1. Visit: https://sui-frontend-ai-platform.vercel.app/
2. Open browser console (F12)
3. Check for any backend connection errors
4. Try training a model to verify the connection

## 🔗 API Endpoints

The backend API is accessible at:
- Base URL: `https://sui-backend-ai-platform.vercel.app`
- API Docs: `https://sui-backend-ai-platform.vercel.app/docs` (if available)
- Health Check: `https://sui-backend-ai-platform.vercel.app/` (returns status JSON)

## 📝 Notes

- Both frontend and backend are deployed on Vercel
- Backend is confirmed running and accessible
- Frontend needs `NEXT_PUBLIC_BACKEND_URL` environment variable to connect
- Make sure to redeploy frontend after setting environment variables

