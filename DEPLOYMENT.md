# CtrlExpense Deployment Guide

## 🚀 Free Hosting Stack
- **Frontend**: Netlify (Free Forever - 100GB bandwidth)
- **Backend**: Render (Free - 512MB RAM)
- **Database**: SQLite on Render (Free - 1GB disk)
- **Domain**: Netlify subdomain (Free)

## 📋 Prerequisites
1. GitHub account
2. Render account (render.com)
3. Netlify account (netlify.com)

## 🔧 Step 1: Deploy Backend to Render

### 1.1 Push to GitHub
```bash
cd backend
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 1.2 Deploy on Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Use these settings:
   - **Name**: `ctrlexpense-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command**: `python manage.py runserver 0.0.0.0:$PORT`

### 1.3 Set Environment Variables
In Render dashboard, add these environment variables:
- `DEBUG` = `False`
- `SECRET_KEY` = `your-secret-key-here` (generate a new one)
- `ALLOWED_HOSTS` = `*`

### 1.4 Get Your API URL
After deployment, you'll get a URL like: `https://ctrlexpense-api.onrender.com`

## 🌐 Step 2: Deploy Frontend to Netlify

### 2.1 Update API URL
1. Copy `.env.example` to `.env`:
```bash
cd frontend
copy .env.example .env
```

2. Update `.env` with your Render API URL:
```
VITE_API_BASE_URL=https://your-app.onrender.com/api
```

### 2.2 Build Frontend
```bash
npm install
npm run build
```

### 2.3 Deploy to Netlify
**Option A: Drag & Drop**
1. Go to [netlify.com](https://netlify.com)
2. Drag the `dist` folder to the deploy area

**Option B: Git Integration**
1. Push frontend to GitHub
2. Connect repository in Netlify
3. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: `VITE_API_BASE_URL=https://your-app.onrender.com/api`

## 🔄 Step 3: Update CORS Settings

After getting your Netlify URL (e.g., `https://your-app.netlify.app`), update Django settings:

1. In Render dashboard, add environment variable:
   - `CORS_ALLOWED_ORIGINS` = `https://your-app.netlify.app`

## ✅ Step 4: Test Your Deployment

1. Visit your Netlify URL
2. Test user registration/login
3. Test adding transactions
4. Check analytics page

## 🔧 Troubleshooting

### Backend Issues
- Check Render logs for errors
- Ensure all environment variables are set
- Verify database migrations ran successfully

### Frontend Issues
- Check browser console for API errors
- Verify API URL in environment variables
- Ensure CORS is properly configured

### Common Issues
- **Cold starts**: Render free tier sleeps after 15 minutes
- **First request slow**: Normal for free tier
- **CORS errors**: Check allowed origins in Django settings

## 🚀 Quick Commands Summary

```bash
# Backend preparation
cd backend
pip freeze > requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate

# Frontend preparation
cd frontend
npm install
npm run build

# Deploy: Push to GitHub → Connect to Render/Netlify
```

## 📱 Your Live App
- **Frontend**: https://your-app.netlify.app
- **Backend API**: https://your-app.onrender.com/api
- **Admin Panel**: https://your-app.onrender.com/admin

## 🎯 Next Steps
1. Set up custom domain (optional)
2. Configure environment-specific settings
3. Set up monitoring and analytics
4. Plan for scaling when needed

Your CtrlExpense app is now live and accessible worldwide! 🎉