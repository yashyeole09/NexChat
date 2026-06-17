# 🚀 NexChat Deployment Guide

## Vercel Frontend Deployment

### Prerequisites
- Vercel account (free: https://vercel.com)
- Backend deployed to a service like Railway, Render, or Heroku
- Frontend code on GitHub/GitLab/Bitbucket

### Step 1: Deploy Backend First
The backend MUST be deployed to a service that supports Java/Spring Boot:
- **Recommended**: Railway.app (easiest for Java)
- **Alternative**: Render.com, Heroku (paid)
- Note the deployed backend URL (e.g., `https://nexchat-backend.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Push to Git Repository**
   ```bash
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   In Vercel project settings → "Environment Variables", add:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_WS_URL=https://your-backend-domain.com
   ```
   Replace `your-backend-domain.com` with your actual backend URL

4. **Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at a `.vercel.app` domain

### Step 3: Update Backend CORS Configuration
In your backend `application.properties`, add:
```properties
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Environment Variables Cheat Sheet

**Development (Local)**
```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080
```

**Production (Vercel)**
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_WS_URL=https://your-backend-domain.com
```

### Common Issues & Solutions

#### Issue: API calls fail with 404
- Check `VITE_API_URL` is correct
- Verify backend is running and accessible
- Check CORS settings on backend

#### Issue: WebSocket connection fails
- Ensure `VITE_WS_URL` matches backend domain
- Verify WebSocket is not blocked by proxy
- Check backend has WebSocket enabled

#### Issue: Build fails
- Run `npm install` locally and verify build: `npm run build`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all environment variables are set

### Local Development Testing
```bash
cd frontend

# Install dependencies
npm install

# Set local environment variables
echo 'VITE_API_URL=http://localhost:8080/api' > .env.local
echo 'VITE_WS_URL=http://localhost:8080' >> .env.local

# Start dev server
npm run dev

# Build for production (test)
npm run build
```

### Monitoring & Debugging

**Check Vercel Logs**
- Go to Vercel Dashboard → Select Project → Deployments
- Click deployment → Functions/Logs tabs
- Check Frontend Logs for errors

**Test Backend Connectivity**
```bash
# Test API endpoint
curl https://your-backend-domain.com/api/auth/login

# Test WebSocket
wscat -c wss://your-backend-domain.com/ws
```

### Performance Tips
1. Enable Vercel's Image Optimization
2. Use Vercel Analytics to monitor performance
3. Enable Caching Headers in backend
4. Consider CDN for static assets

### Next Steps
1. ✅ Deploy backend to Railway/Render
2. ✅ Get backend URL
3. ✅ Add environment variables to Vercel
4. ✅ Deploy frontend to Vercel
5. ✅ Test all features
6. ✅ Setup custom domain (optional)

---
**Need help?** Check Vercel docs: https://vercel.com/docs
