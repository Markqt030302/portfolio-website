# AI Video Editor Portfolio Website

A modern, professional portfolio website designed for AI video editors to showcase their work, skills, and connect with potential clients.

## Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Portfolio Showcase** - Filterable video portfolio grid
- **Video Modal** - Click portfolio items to view videos in a modal player
- **Skills Section** - Highlight your AI tools and editing software expertise
- **Contact Form** - Easy way for clients to reach you
- **Social Media Links** - Connect all your professional profiles
- **Smooth Scrolling** - Enhanced user experience with smooth navigation
- **Animated Statistics** - Eye-catching stats counter in the about section

## Customization Guide

### 1. Personal Information

Edit `index.html` to add your details:

- **Line 7**: Change the page title
- **Lines 13-14**: Update your name in the navigation
- **Lines 23-25**: Update hero section name and tagline
- **Lines 41-45**: Replace profile image and add your photo
- **Lines 47-50**: Write your personal bio
- **Lines 54-66**: Update your statistics (projects, clients, experience)

### 2. Portfolio Videos

To add your video projects:

1. Replace placeholder images in the portfolio section (lines 87-179)
2. Update video titles and descriptions
3. Modify tags to match your project types
4. Add actual YouTube/Vimeo URLs in `script.js` (line 126)

**For YouTube videos:**
- Upload your video to YouTube
- Get the embed URL: `https://www.youtube.com/embed/VIDEO_ID`
- Replace placeholder URLs in the `videoUrls` array

**For Vimeo videos:**
- Upload to Vimeo
- Use format: `https://player.vimeo.com/video/VIDEO_ID`

### 3. Upload Your Videos

You have several options:

#### Option A: YouTube (Recommended)
1. Create a YouTube channel
2. Upload your edited videos
3. Set videos as "Unlisted" if you want them only viewable via your portfolio
4. Copy the video ID from the URL
5. Update the `videoUrls` array in `script.js`

#### Option B: Vimeo
1. Create a Vimeo account
2. Upload videos (free tier has weekly limits)
3. Get embed codes for each video
4. Update the video URLs in `script.js`

#### Option C: Self-Hosted
1. Use video hosting services like AWS S3, Cloudinary, or Bunny.net
2. Upload your video files
3. Get the direct video URLs
4. Modify the modal to use `<video>` tags instead of iframes

### 4. Profile Photo

Replace the placeholder image:
- Prepare a professional photo (400x500px recommended)
- Save it as `profile.jpg` in the same folder
- Update line 43: `<img src="profile.jpg" alt="Your Name">`

### 5. Skills & Tools

Update the skills section (lines 185-253) to match your expertise:
- AI Tools you use
- Editing software you're proficient in
- Creative skills
- Technical abilities

### 6. Contact Information

Update contact details (lines 270-295):
- Email address
- Phone number
- Location
- Social media links (LinkedIn, YouTube, Instagram, Twitter, Vimeo)

### 7. Colors & Branding

Customize the color scheme in `styles.css`:

```css
:root {
    --primary-color: #667eea;    /* Main brand color */
    --secondary-color: #764ba2;   /* Secondary color */
    --accent-color: #f093fb;      /* Accent highlights */
}
```

## Deployment Options

### Option 1: Netlify (Recommended - Free)

1. Create a free account at [netlify.com](https://netlify.com)
2. Drag and drop your folder (index.html, styles.css, script.js, images)
3. Your site will be live instantly at `yourname.netlify.app`
4. Optional: Connect a custom domain

### Option 2: GitHub Pages (Free)

1. Create a GitHub account
2. Create a new repository named `username.github.io`
3. Upload your files
4. Enable GitHub Pages in settings
5. Your site will be live at `username.github.io`

### Option 3: Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your project
3. Deploy with one click
4. Get a custom URL: `yourname.vercel.app`

### Option 4: Traditional Web Hosting

Upload files via FTP to any web hosting provider:
- Bluehost
- HostGator
- SiteGround
- Any other hosting service with your domain

## Setting Up the Contact Form

The current form is frontend-only. To make it functional:

### Option A: EmailJS (Free, Easy)

1. Sign up at [emailjs.com](https://emailjs.com)
2. Create an email service
3. Get your service ID and template ID
4. Add this code to `script.js`:

```javascript
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
    .then(() => alert("Message sent!"))
    .catch(() => alert("Error sending message"));
```

### Option B: Formspree (Free)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a form
3. Update the form action in HTML:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option C: Backend Service

Create a simple backend using:
- Node.js + Express + Nodemailer
- PHP mail function
- Python Flask/Django
- Netlify Functions

## File Structure

```
CV/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Interactive functionality
├── README.md           # This file
└── (your images)       # Add your photos here
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Tips for Best Results

1. **Use High-Quality Thumbnails**: Create custom thumbnails for your videos (1280x720px)
2. **Optimize Images**: Compress images to improve loading speed
3. **Professional Photo**: Use a high-quality, well-lit professional headshot
4. **Portfolio Selection**: Showcase your 6-12 best projects
5. **Keep It Updated**: Regularly add new projects
6. **SEO**: Update meta tags and add descriptions
7. **Analytics**: Add Google Analytics to track visitors

## Performance Optimization

1. Compress all images using tools like:
   - TinyPNG
   - Squoosh
   - ImageOptim

2. Consider lazy loading for portfolio images
3. Use a CDN for faster global delivery
4. Enable caching on your hosting

## Support & Updates

This is a starter template. Customize it to match your personal brand and style!

## License

Free to use and modify for personal and commercial projects.

---

Built with ❤️ for creative video editors
