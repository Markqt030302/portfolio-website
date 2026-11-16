# ✅ Deployment Checklist

Use this checklist to deploy your portfolio step by step.

## Before You Start

- [ ] You have a GitHub account (https://github.com)
- [ ] You have a Render account (https://render.com)
- [ ] You have a Netlify account (https://netlify.com)
- [ ] Git is installed on your computer
- [ ] You've tested the site locally (`npm start`)

---

## Part 1: Push to GitHub

- [ ] Open PowerShell in `C:\Users\Marky\Downloads\CV`
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Portfolio website ready for deployment"`
- [ ] Create new repository on GitHub (name: `portfolio-website`)
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Verify files are on GitHub

**✅ GitHub Done!**

---

## Part 2: Deploy Backend to Render

- [ ] Go to https://render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Configure:
  - Name: `portfolio-backend`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: `Free`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Check logs show "Portfolio Server Running!"
- [ ] **📋 COPY AND SAVE YOUR BACKEND URL**
  - Example: `https://portfolio-backend-xxx.onrender.com`
  - Write it here: _______________________________________

**✅ Backend Deployed!**

---

## Part 3: Update Frontend Configuration

- [ ] Open `config.js` in your code editor
- [ ] Find line 5:
  ```javascript
  : 'https://your-backend-url.onrender.com'
  ```
- [ ] Replace with YOUR actual Render URL
- [ ] Save the file
- [ ] Commit and push changes:
  ```powershell
  git add config.js
  git commit -m "Update backend URL"
  git push
  ```

**✅ Config Updated!**

---

## Part 4: Prepare Frontend Files

- [ ] Open PowerShell in `C:\Users\Marky\Downloads\CV`
- [ ] Run: `.\prepare-netlify.ps1`
- [ ] Verify `netlify-deploy` folder was created
- [ ] Check that folder contains:
  - index.html
  - admin.html
  - All CSS files
  - All JS files
  - config.js (with updated URL!)

**✅ Frontend Ready!**

---

## Part 5: Deploy to Netlify

### Option A: Drag & Drop

- [ ] Go to https://netlify.com
- [ ] Click "Add new site" → "Deploy manually"
- [ ] Drag the entire `netlify-deploy` folder
- [ ] Wait for deployment (1-2 minutes)
- [ ] **📋 COPY AND SAVE YOUR FRONTEND URL**
  - Example: `https://random-name-123.netlify.app`
  - Write it here: _______________________________________

### Option B: GitHub (Recommended)

- [ ] Go to https://netlify.com
- [ ] Click "Add new site" → "Import from Git"
- [ ] Connect GitHub and select your repository
- [ ] Build settings:
  - Build command: (leave empty)
  - Publish directory: `/`
- [ ] Click "Deploy site"
- [ ] **📋 COPY AND SAVE YOUR FRONTEND URL**
  - Write it here: _______________________________________

**✅ Frontend Deployed!**

---

## Part 6: Configure CORS on Backend

- [ ] Go back to Render dashboard
- [ ] Click your `portfolio-backend` service
- [ ] Click "Environment" tab
- [ ] Click "Add Environment Variable"
- [ ] Add variable:
  - Key: `FRONTEND_URL`
  - Value: Your Netlify URL (paste from above)
- [ ] Click "Save Changes"
- [ ] Wait for service to restart (1-2 minutes)

**✅ CORS Configured!**

---

## Part 7: Final Testing

- [ ] Open your Netlify URL in browser
- [ ] Main page loads correctly
- [ ] Navigation works
- [ ] Portfolio section displays
- [ ] Go to `/admin.html`
- [ ] Admin panel loads
- [ ] Click "Add New Video"
- [ ] Modal opens
- [ ] Try uploading a small video (< 50MB)
- [ ] Upload succeeds (may take 30-60 seconds first time due to Render wake-up)
- [ ] Video appears in admin list
- [ ] Go back to main page
- [ ] Video appears in carousel
- [ ] Video plays correctly
- [ ] Try editing video title
- [ ] Try deleting video

**✅ Everything Works!**

---

## Part 8: Bookmark Your URLs

Save these URLs:

1. **Your Live Portfolio**: _______________________________________
2. **Admin Panel**: _______________________________________/admin.html
3. **Backend API**: _______________________________________
4. **GitHub Repo**: https://github.com/YOUR_USERNAME/portfolio-website
5. **Render Dashboard**: https://dashboard.render.com
6. **Netlify Dashboard**: https://app.netlify.com

---

## 🎉 Congratulations!

Your portfolio is now live on the internet!

### Next Steps:

1. **Share your portfolio URL** with potential clients/employers
2. **Add your projects** through the admin panel
3. **Customize domain** (optional):
   - Buy domain from Namecheap, GoDaddy, etc.
   - Connect to Netlify in Domain Settings
4. **Add password to admin** for security
5. **Upgrade to paid tier** if you need:
   - Faster response times
   - Persistent video storage
   - No spin-down delays

### Important Reminders:

⚠️ **Render Free Tier Limitations:**
- Sleeps after 15 min inactivity
- First request takes 30-50 seconds
- Videos reset on service restart
- Good for testing, upgrade for production

📧 **Add Password Protection:**
Consider adding authentication to `/admin.html` to prevent unauthorized access.

☁️ **For Production:**
Use cloud storage (Cloudinary, AWS S3) for videos instead of local uploads.

---

## 🆘 Troubleshooting

If something doesn't work:

1. **Check browser console** (Press F12)
2. **Check Render logs** (Render Dashboard → Logs)
3. **Verify config.js** has correct backend URL
4. **Verify CORS** environment variable is set
5. **Wait 60 seconds** for Render to wake up on first request

**Read DEPLOYMENT.md for detailed troubleshooting!**

---

**Need to update your site?**

1. Make changes locally
2. Test with `npm start`
3. Push to GitHub: `git push`
4. Render auto-updates (if connected to GitHub)
5. Run `prepare-netlify.ps1` again
6. Re-deploy to Netlify

---

Date deployed: _______________
Portfolio URL: _______________
Admin password: _______________
