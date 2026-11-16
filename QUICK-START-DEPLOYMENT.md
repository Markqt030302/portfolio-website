# 🚀 Quick Start: Deploy to Netlify + Render

Follow these steps in order:

## ✅ Step 1: Push Code to GitHub (5 minutes)

Open PowerShell in this folder and run:

```powershell
git init
git add .
git commit -m "Portfolio website initial commit"
```

Then create a new repository on GitHub (https://github.com/new) and run:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## ✅ Step 2: Deploy Backend to Render (10 minutes)

1. Go to **https://render.com** → Sign up (it's free!)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your repository
4. Fill in:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **📋 COPY YOUR URL**: It will look like `https://portfolio-backend-xxx.onrender.com`

## ✅ Step 3: Update Config File (1 minute)

1. Open `config.js` in this folder
2. Replace line 5:

```javascript
: 'https://your-backend-url.onrender.com' // ← Paste your Render URL here
```

Example:
```javascript
: 'https://portfolio-backend-abc123.onrender.com'
```

3. Save the file

## ✅ Step 4: Prepare Frontend Files (1 minute)

Run this PowerShell script:

```powershell
.\prepare-netlify.ps1
```

This creates a `netlify-deploy` folder with only frontend files.

## ✅ Step 5: Deploy Frontend to Netlify (5 minutes)

### Option A: Drag & Drop (Easiest)

1. Go to **https://netlify.com** → Sign up (it's free!)
2. Click **"Add new site"** → **"Deploy manually"**
3. **Drag and drop** the entire `netlify-deploy` folder
4. Wait 1-2 minutes
5. **📋 COPY YOUR URL**: It will look like `https://random-name-123.netlify.app`

### Option B: Connect GitHub (Better for updates)

1. Go to **https://netlify.com**
2. Click **"Add new site"** → **"Import from Git"**
3. Select your GitHub repository
4. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `/`
5. Click **"Deploy site"**

## ✅ Step 6: Update Backend CORS (2 minutes)

1. Go back to **Render dashboard** (https://dashboard.render.com)
2. Click your **portfolio-backend** service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
   - **Key**: `FRONTEND_URL`
   - **Value**: Your Netlify URL (e.g., `https://your-site.netlify.app`)
5. Click **"Save Changes"** (backend will restart)

## ✅ Step 7: Test Your Site! (2 minutes)

1. Open your Netlify URL
2. Click around to see your portfolio
3. Go to `/admin.html` (e.g., `https://your-site.netlify.app/admin.html`)
4. Try uploading a video
5. Go back to main page and check if video appears

## 🎉 Done! Your Portfolio is Live!

### Your URLs:
- **Frontend (Portfolio)**: `https://your-site.netlify.app`
- **Admin Panel**: `https://your-site.netlify.app/admin.html`
- **Backend API**: `https://your-backend.onrender.com`

### ⚠️ Important Notes:

1. **Render Free Tier Limitations:**
   - Goes to sleep after 15 minutes of inactivity
   - First request takes 30-50 seconds to wake up
   - Videos are stored temporarily (lost on restart)
   - Good for testing, not for production

2. **For Production:**
   - Upgrade Render to paid tier ($7/month) for persistent storage
   - Or use cloud storage (Cloudinary, AWS S3) for videos
   - Consider adding password protection to admin panel

3. **Making Updates:**
   - Change code → Push to GitHub
   - Render and Netlify auto-deploy from GitHub (if using Option B)
   - Or re-run `prepare-netlify.ps1` and drag to Netlify again

## 🆘 Having Issues?

### Backend not responding
- Check Render logs: Dashboard → Your service → "Logs"
- Make sure it says "Portfolio Server Running!"

### Videos not uploading
- Open browser console (F12)
- Check if `config.js` has correct Render URL
- Verify CORS settings on Render

### Frontend errors
- Press F12 → Console tab
- Look for red error messages
- Make sure all files copied to Netlify

---

**Read DEPLOYMENT.md for detailed troubleshooting and production tips!**
