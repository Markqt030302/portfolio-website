# Prepare files for Netlify deployment
# This script copies only frontend files to a 'netlify-deploy' folder

Write-Host "📦 Preparing files for Netlify deployment..." -ForegroundColor Cyan

# Create netlify-deploy folder
$deployFolder = "netlify-deploy"
if (Test-Path $deployFolder) {
    Remove-Item $deployFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $deployFolder | Out-Null

# Frontend files to copy
$frontendFiles = @(
    "index.html",
    "admin.html",
    "styles.css",
    "admin-styles.css",
    "script.js",
    "admin-script.js",
    "portfolio-loader.js",
    "carousel.js",
    "config.js",
    "README.md"
)

Write-Host "📁 Copying frontend files..." -ForegroundColor Yellow

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $deployFolder
        Write-Host "  ✓ Copied $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Warning: $file not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Done! Frontend files are ready in '$deployFolder' folder" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy backend to Render first (see DEPLOYMENT.md)" -ForegroundColor White
Write-Host "2. Update config.js with your Render backend URL" -ForegroundColor White
Write-Host "3. Drag & drop the '$deployFolder' folder to Netlify" -ForegroundColor White
Write-Host "4. Or zip it and upload to Netlify" -ForegroundColor White
Write-Host ""
Write-Host "📖 Read DEPLOYMENT.md for detailed instructions" -ForegroundColor Yellow
