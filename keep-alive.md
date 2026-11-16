# Keep Render Server Awake (Free Solutions)

Your Render backend sleeps after 15 minutes of inactivity. Here are free ways to keep it awake:

## Option 1: UptimeRobot (Recommended)
1. Go to https://uptimerobot.com (Free account)
2. Add New Monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: Portfolio Backend
   - URL: https://portfolio-website-7d97.onrender.com/api/health
   - Monitoring Interval: 5 minutes
3. This will ping your server every 5 minutes to keep it awake

## Option 2: Cron-Job.org
1. Go to https://cron-job.org (Free account)
2. Create new cronjob:
   - URL: https://portfolio-website-7d97.onrender.com/api/health
   - Schedule: Every 5 minutes
   - Save

## Option 3: Self-Ping (Add to your site)
Add this to your portfolio-loader.js to ping the backend periodically:

```javascript
// Keep backend awake
setInterval(() => {
    fetch(`${API_URL}/api/health`).catch(() => {});
}, 5 * 60 * 1000); // Every 5 minutes
```

## Downsides:
- Uses your monthly bandwidth (750 hours free on Render)
- If you use all 750 hours, server stops until next month
- Still has brief delays during cold starts

## Best Solution: Upgrade Render (Paid)
- Cost: $7/month
- Benefits:
  - No sleep/wake delays
  - Persistent storage (videos won't be lost)
  - Better performance
  - More bandwidth
  
Go to: https://dashboard.render.com → Your service → Upgrade

---

**For now, the free tier works fine for a portfolio!** The first load is slow, but after that it's fast. Visitors won't mind waiting 30 seconds once.
