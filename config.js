// API Configuration
const config = {
    // Change this to your deployed backend URL after deployment
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://your-backend-url.onrender.com' // You'll update this after deploying to Render
};

// Make config available globally
window.API_CONFIG = config;
