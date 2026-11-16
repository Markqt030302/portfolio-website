# 📂 Project Files Summary

## 🌐 Frontend Files (Deploy to Netlify)
These files make up your website that visitors see:

- **index.html** - Main portfolio page
- **admin.html** - Admin panel for managing content
- **styles.css** - Main site styling
- **admin-styles.css** - Admin panel styling
- **script.js** - Main site functionality
- **admin-script.js** - Admin panel functionality
- **portfolio-loader.js** - Loads videos from database
- **carousel.js** - Video carousel/slider
- **config.js** - ⚠️ API configuration (UPDATE THIS with your Render URL!)
- **README.md** - Project documentation

## 🖥️ Backend Files (Deploy to Render)
These files run the server:

- **server.js** - Express server with API endpoints
- **package.json** - Node.js dependencies
- **portfolio.db** - SQLite database (auto-created)
- **uploads/** - Folder for uploaded videos & thumbnails

## 📚 Documentation Files
Guides to help you deploy:

- **QUICK-START-DEPLOYMENT.md** - ⭐ Start here! Step-by-step deployment guide
- **DEPLOYMENT.md** - Detailed deployment instructions & troubleshooting
- **FILES-SUMMARY.md** - This file

## 🛠️ Helper Scripts

- **prepare-netlify.ps1** - PowerShell script to prepare frontend files
- **START-SERVER.bat** - Starts local server (for testing)

## 🚫 Files NOT to Deploy

- **.gitignore** - Git configuration
- **node_modules/** - Dependencies (installed automatically)
- **uploads/** - Don't push to GitHub (too large)
- **portfolio.db** - Database file (auto-created on server)
- **START-SERVER.bat** - Only for local testing

## 📦 What Goes Where?

### To GitHub:
```
✅ All files except:
   - node_modules/
   - uploads/
   - portfolio.db
```

### To Render (Backend):
```
✅ Deploys from GitHub automatically
   Render will install node_modules itself
```

### To Netlify (Frontend):
```
✅ Only these files:
   - index.html
   - admin.html
   - styles.css
   - admin-styles.css
   - script.js
   - admin-script.js
   - portfolio-loader.js
   - carousel.js
   - config.js (UPDATED with Render URL!)
   - README.md (optional)
```

## 🔄 Deployment Workflow

```
1. Code Changes (Local)
   ↓
2. Test Locally (npm start)
   ↓
3. Push to GitHub
   ↓
4. Render auto-deploys backend
   ↓
5. Update config.js with Render URL
   ↓
6. Run prepare-netlify.ps1
   ↓
7. Upload netlify-deploy folder to Netlify
   ↓
8. Done! ✅
```

## ⚠️ IMPORTANT: config.js

Before deploying to Netlify, **YOU MUST** update `config.js`:

```javascript
const config = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://YOUR-ACTUAL-RENDER-URL.onrender.com' // ← CHANGE THIS!
};
```

Replace `YOUR-ACTUAL-RENDER-URL` with your actual Render backend URL.

## 🎯 Quick Commands

### Test Locally:
```powershell
npm start
```
Then open: http://localhost:3000/admin.html

### Prepare for Netlify:
```powershell
.\prepare-netlify.ps1
```

### Push to GitHub:
```powershell
git add .
git commit -m "Update message"
git push
```

---

**Need help? Read QUICK-START-DEPLOYMENT.md**
