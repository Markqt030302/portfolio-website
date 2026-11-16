// API Configuration
const config = {
    // Change this to your deployed backend URL after deployment
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://portfolio-website-7d97.onrender.com' // Your Render backend URL
};

// Make config available globally
window.API_CONFIG = config;
