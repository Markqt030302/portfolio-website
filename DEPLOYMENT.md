# Deployment Guide

This portfolio website requires deploying two parts:
1. **Backend** (Node.js + SQLite) → Render
2. **Frontend** (HTML/CSS/JS) → Netlify

## Step 1: Deploy Backend to Render

### 1.1 Create GitHub Repository for Backend

First, we need to push your code to GitHub. Open PowerShell in this folder and run:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Portfolio backend"

# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 1.2 Deploy on Render

1. Go to https://render.com and sign up/login (free tier available)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `portfolio-backend` (or any name you want)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Add Environment Variables (Optional):
   - `FRONTEND_URL`: (You'll add this after deploying frontend)
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://portfolio-backend-xxx.onrender.com`)

### 1.3 Important Note about Render Free Tier
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-50 seconds to wake up
- Upload folder is temporary - videos will be lost on restart
- For production, consider upgrading or using cloud storage (Cloudinary, AWS S3)

## Step 2: Update Frontend Configuration

1. Open `config.js` in your project
2. Update line 5 with your Render backend URL:

```javascript
const config = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://your-actual-backend-url.onrender.com' // ← Replace this
};
```

Example:
```javascript
: 'https://portfolio-backend-abc123.onrender.com'
```

## Step 3: Deploy Frontend to Netlify

### 3.1 Option A: Drag & Drop (Easiest)

1. Go to https://netlify.com and sign up/login
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop these files/folders from your project:
   - `index.html`
   - `admin.html`
   - `styles.css`
   - `admin-styles.css`
   - `script.js`
   - `admin-script.js`
   - `portfolio-loader.js`
   - `carousel.js`
   - `config.js`
   - `README.md` (optional)
4. Netlify will deploy and give you a URL like `https://random-name-123.netlify.app`

### 3.2 Option B: GitHub (Better for updates)

1. Create a separate GitHub repository for frontend
2. Push only the frontend files (HTML, CSS, JS)
3. On Netlify: **"Add new site"** → **"Import from Git"**
4. Select your frontend repository
5. Build settings:
   - **Build command**: Leave empty
   - **Publish directory**: `/`
6. Click **"Deploy site"**

### 3.3 Custom Domain (Optional)

1. On Netlify dashboard → **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow instructions to configure your domain's DNS

## Step 4: Update Backend CORS

1. Go back to your Render dashboard
2. Click on your backend service
3. Go to **"Environment"**
4. Add/Update environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your Netlify URL (e.g., `https://your-site.netlify.app`)
5. Save changes (service will restart automatically)

## Step 5: Test Everything

1. Open your Netlify site URL
2. Go to `/admin.html`
3. Try uploading a video
4. Check if it appears on the main site
5. Test editing and deleting videos

## Troubleshooting

### Backend Issues
- **Build failed**: Check Node.js version in Render dashboard
- **Videos not uploading**: Check Render logs for errors
- **CORS error**: Make sure `FRONTEND_URL` is set correctly

### Frontend Issues
- **Can't connect to backend**: Check `config.js` URL is correct
- **API calls failing**: Open browser console (F12) to see errors
- **Videos not showing**: Check if backend is awake (visit backend URL directly)

### Common Errors
1. **"Failed to fetch"** → Backend URL in config.js is wrong
2. **"CORS policy"** → Frontend URL not added to backend environment variables
3. **"500 Internal Server Error"** → Check Render logs for backend errors

## Local Development

To test locally after deployment:

```bash
# Make sure config.js uses localhost
npm start
```

Then open:
- Main site: http://localhost:3000/index.html
- Admin: http://localhost:3000/admin.html

## Production Recommendations

For a production site, consider:
1. **Persistent video storage**: Cloudinary, AWS S3, or Backblaze B2
2. **Database**: PostgreSQL instead of SQLite (available on Render)
3. **Paid hosting**: For faster response times and no spin-down
4. **CDN**: For faster video delivery
5. **Authentication**: Add password protection to admin panel

## Need Help?

- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- Check browser console (F12) for frontend errors
- Check Render logs for backend errors
