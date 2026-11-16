// Portfolio data storage
let portfolioData = {
    profile: {
        name: "Your Name",
        jobTitle: "AI Video Editor",
        tagline: "Creative Storyteller",
        aboutPara1: "I'm a passionate AI Video Editor with years of experience in creating engaging content that captivates audiences.",
        aboutPara2: "My approach combines technical expertise with artistic vision, utilizing the latest AI technologies.",
        profilePhoto: "",
        stats: {
            projects: 150,
            clients: 50,
            years: 5
        }
    },
    portfolio: [],
    skills: {
        ai: "Runway ML\nAdobe Sensei\nTopaz Video AI\nDescript\nSynthesia",
        editing: "Adobe Premiere Pro\nDaVinci Resolve\nFinal Cut Pro\nAfter Effects\nCapCut Pro",
        creative: "Color Grading\nMotion Graphics\nSound Design\nVisual Effects\nStorytelling",
        technical: "4K/8K Workflow\nAI Upscaling\nAuto-Captioning\nBatch Processing\nCloud Collaboration"
    },
    contact: {
        email: "your.email@example.com",
        phone: "+1 (234) 567-890",
        location: "Your City, Country"
    },
    social: {
        linkedin: "",
        youtube: "",
        instagram: "",
        twitter: "",
        vimeo: ""
    }
};

// Load data from localStorage and backend
async function loadData() {
    console.log('🔄 Loading data from backend...');
    
    // First try to load from backend API
    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';
        console.log('API URL:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/get-portfolio`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            const serverData = result.data;
            
            console.log('Server data:', serverData);
            
            // Merge server data with default portfolioData
            if (serverData.profile) {
                portfolioData.profile = { ...portfolioData.profile, ...serverData.profile };
                console.log('✅ Loaded profile from backend');
            }
            if (serverData.skills) {
                portfolioData.skills = { ...portfolioData.skills, ...serverData.skills };
                console.log('✅ Loaded skills from backend');
            }
            if (serverData.contact) {
                portfolioData.contact = { ...portfolioData.contact, ...serverData.contact };
                console.log('✅ Loaded contact from backend');
            }
            
            // Save merged data to localStorage
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
            
            console.log('✅ Data loaded from backend API successfully');
        }
    } catch (error) {
        console.error('❌ Error loading from backend:', error);
        // Fall back to localStorage
        const saved = localStorage.getItem('portfolioData');
        if (saved) {
            portfolioData = JSON.parse(saved);
            console.log('📦 Loaded from localStorage instead');
        }
    }
    
    // If no backend data, try localStorage
    if (!portfolioData.profile.name || portfolioData.profile.name === 'Your Name') {
        const saved = localStorage.getItem('portfolioData');
        if (saved) {
            portfolioData = JSON.parse(saved);
            console.log('📦 Using localStorage data');
        }
    }
    
    populateFields();
    
    // Also load videos from server and sync to localStorage
    syncVideosFromServer();
}

// Sync videos from server API to localStorage
async function syncVideosFromServer() {
    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/videos`);
        
        if (!response.ok) {
            console.log('Could not fetch videos from server');
            return;
        }
        
        const data = await response.json();
        const serverVideos = data.videos || [];
        
        if (serverVideos.length > 0) {
            // Convert server video format to portfolio format
            portfolioData.portfolio = serverVideos.map(video => ({
                title: video.title,
                thumbnail: video.thumbnail_url,
                videoData: video.video_url,
                videoSource: video.upload_type || 'direct',
                description: '',
                category: 'all',
                tags: []
            }));
            
            // Save to localStorage
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
            
            // Re-render portfolio list
            renderPortfolioList();
            
            console.log(`Synced ${serverVideos.length} videos from server`);
        }
    } catch (error) {
        console.error('Error syncing videos from server:', error);
    }
}

// Save data to localStorage and backend
async function saveData() {
    console.log('💾 Saving data...');
    
    // Save to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    console.log('✅ Saved to localStorage');
    
    // Also save to backend API
    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';
        console.log('Saving to backend:', apiUrl);
        
        // Save profile data
        const profileResponse = await fetch(`${apiUrl}/api/save-portfolio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: 'profile',
                value: portfolioData.profile
            })
        });
        console.log('Profile save response:', profileResponse.status);
        
        // Save skills data
        const skillsResponse = await fetch(`${apiUrl}/api/save-portfolio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: 'skills',
                value: portfolioData.skills
            })
        });
        console.log('Skills save response:', skillsResponse.status);
        
        // Save contact data
        const contactResponse = await fetch(`${apiUrl}/api/save-portfolio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: 'contact',
                value: portfolioData.contact
            })
        });
        console.log('Contact save response:', contactResponse.status);
        
        showSuccessMessage('All changes saved successfully to server!');
        console.log('✅ Data saved to backend API');
    } catch (error) {
        console.error('❌ Error saving to backend:', error);
        showSuccessMessage('Saved locally (server sync failed)');
    }
}

// Populate form fields
function populateFields() {
    // Profile
    document.getElementById('userName').value = portfolioData.profile.name;
    document.getElementById('jobTitle').value = portfolioData.profile.jobTitle;
    document.getElementById('tagline').value = portfolioData.profile.tagline;
    document.getElementById('aboutPara1').value = portfolioData.profile.aboutPara1;
    document.getElementById('aboutPara2').value = portfolioData.profile.aboutPara2;
    
    if (portfolioData.profile.profilePhoto) {
        document.getElementById('profilePhotoPreview').src = portfolioData.profile.profilePhoto;
    }

    // Skills - AI Tools only
    document.getElementById('skillsAI').value = portfolioData.skills.ai;

    // Contact
    document.getElementById('contactEmail').value = portfolioData.contact.email;
    document.getElementById('contactPhone').value = portfolioData.contact.phone;
    document.getElementById('contactLocation').value = portfolioData.contact.location;

    // Portfolio
    renderPortfolioList();
}

// Collect data from forms
function collectData() {
    // Profile
    portfolioData.profile.name = document.getElementById('userName').value;
    portfolioData.profile.jobTitle = document.getElementById('jobTitle').value;
    portfolioData.profile.tagline = document.getElementById('tagline').value;
    portfolioData.profile.aboutPara1 = document.getElementById('aboutPara1').value;
    portfolioData.profile.aboutPara2 = document.getElementById('aboutPara2').value;

    // Skills - AI Tools only
    portfolioData.skills.ai = document.getElementById('skillsAI').value;

    // Contact
    portfolioData.contact.email = document.getElementById('contactEmail').value;
    portfolioData.contact.phone = document.getElementById('contactPhone').value;
    portfolioData.contact.location = document.getElementById('contactLocation').value;
}

// Show success message
function showSuccessMessage(message) {
    const existing = document.querySelector('.success-message');
    if (existing) existing.remove();

    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// Navigation
document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show section
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');
        
        // Update title
        const titles = {
            profile: 'Profile Information',
            portfolio: 'Portfolio Videos',
            skills: 'Skills Management',
            contact: 'Contact Information'
        };
        document.getElementById('section-title').textContent = titles[section];
    });
});

// Profile Photo Upload
document.getElementById('profilePhotoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.getElementById('profilePhotoPreview');
            img.src = event.target.result;
            portfolioData.profile.profilePhoto = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Portfolio Modal
const portfolioModal = document.getElementById('portfolioModal');
const addPortfolioBtn = document.getElementById('addPortfolioBtn');
const cancelPortfolioBtn = document.getElementById('cancelPortfolioBtn');
const savePortfolioBtn = document.getElementById('savePortfolioBtn');
let editingPortfolioIndex = null;
let currentVideoData = null;
let currentThumbnailData = null;
let currentVideoSource = 'direct'; // 'direct' or 'embed'

addPortfolioBtn.addEventListener('click', () => {
    console.log('Add Portfolio button clicked');
    console.log('Modal element:', portfolioModal);
    
    editingPortfolioIndex = null;
    clearPortfolioForm();
    
    if (portfolioModal) {
        portfolioModal.classList.add('active');
        console.log('Modal should be visible now');
    } else {
        console.error('Portfolio modal not found!');
        alert('Error: Modal not found. Please refresh the page.');
    }
});

cancelPortfolioBtn.addEventListener('click', () => {
    portfolioModal.classList.remove('active');
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        portfolioModal.classList.remove('active');
    });
});

// Upload method toggle
let currentUploadMethod = 'youtube'; // default to YouTube

document.getElementById('methodYoutube')?.addEventListener('click', function() {
    currentUploadMethod = 'youtube';
    document.getElementById('youtubeMethod').style.display = 'block';
    document.getElementById('directMethod').style.display = 'none';
    document.getElementById('methodYoutube').classList.add('active');
    document.getElementById('methodDirect').classList.remove('active');
});

document.getElementById('methodDirect')?.addEventListener('click', function() {
    currentUploadMethod = 'direct';
    document.getElementById('youtubeMethod').style.display = 'none';
    document.getElementById('directMethod').style.display = 'block';
    document.getElementById('methodDirect').classList.add('active');
    document.getElementById('methodYoutube').classList.remove('active');
});

// YouTube/Vimeo Link Handler
document.getElementById('loadVideoPreview')?.addEventListener('click', function() {
    const videoLink = document.getElementById('videoLink').value.trim();
    
    if (!videoLink) {
        alert('Please enter a video link');
        return;
    }

    const embedUrl = convertToEmbedUrl(videoLink);
    
    if (!embedUrl) {
        alert('Invalid video link. Please use YouTube or Vimeo links.');
        return;
    }

    // Set video data
    currentVideoData = embedUrl;
    currentThumbnailData = generateThumbnailFromEmbed(videoLink);
    currentVideoSource = 'embed';
    
    // Show preview
    const preview = document.getElementById('videoLinkPreview');
    const iframe = document.getElementById('videoIframePreview');
    iframe.src = embedUrl;
    preview.style.display = 'block';
    
    showSuccessMessage('Video loaded successfully!');
});

// Convert YouTube/Vimeo URL to embed URL
function convertToEmbedUrl(url) {
    // YouTube patterns
    const youtubePatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/
    ];
    
    for (let pattern of youtubePatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
    }
    
    // Vimeo pattern
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // If already an embed URL
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) {
        return url;
    }
    
    return null;
}

// Generate thumbnail from embed URL
function generateThumbnailFromEmbed(url) {
    // YouTube thumbnail
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch && youtubeMatch[1]) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    
    // Vimeo thumbnail (placeholder - would need API call for real thumbnail)
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
        // Using a placeholder - in production, you'd fetch from Vimeo API
        return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
    }
    
    return 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Video';
}

// Video Upload Handler - Cloudinary
const selectVideoBtn = document.getElementById('selectVideoBtn');
const videoFileInput = document.getElementById('videoFileInput');
const videoPreview = document.getElementById('videoPreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadProgress = document.getElementById('uploadProgress');
const uploadInfo = document.getElementById('uploadInfo');
const uploadInfoText = document.getElementById('uploadInfoText');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const compressionStatus = document.getElementById('compressionStatus');
const compressionProgressFill = document.getElementById('compressionProgressFill');
const compressionProgressText = document.getElementById('compressionProgressText');
const compressionTitle = document.getElementById('compressionTitle');
const compressionMessage = document.getElementById('compressionMessage');

// Select video file
selectVideoBtn.addEventListener('click', () => {
    videoFileInput.click();
});

// Handle video file selection
videoFileInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        uploadPlaceholder.style.display = 'none';
        compressionStatus.style.display = 'block';
        
        const fileSizeMB = file.size / (1024 * 1024);
        console.log(`Selected video: ${file.name}, Size: ${fileSizeMB.toFixed(2)}MB`);

        // Show processing status
        compressionTitle.textContent = 'Processing Video...';
        compressionMessage.textContent = `File size: ${fileSizeMB.toFixed(2)}MB - Preparing for upload...`;
        compressionProgressFill.style.width = '50%';
        compressionProgressText.textContent = '50%';

        // No compression - use original file
        const processedFile = file;
        
        // Convert to base64 for preview
        compressionTitle.textContent = 'Preparing Preview...';
        compressionMessage.textContent = 'Generating thumbnail...';
        compressionProgressFill.style.width = '75%';
        compressionProgressText.textContent = '75%';
        
        const reader = new FileReader();
        reader.onload = function(event) {
            currentVideoData = event.target.result;
            currentVideoSource = 'direct';
            
            // Generate thumbnail
            videoPreview.src = currentVideoData;
            videoPreview.style.display = 'block';
            videoPreview.load();
            
            videoPreview.onloadeddata = function() {
                // Generate thumbnail from first frame
                const canvas = document.getElementById('thumbnailCanvas');
                canvas.width = videoPreview.videoWidth;
                canvas.height = videoPreview.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
                currentThumbnailData = canvas.toDataURL('image/jpeg', 0.8);
                
                console.log('Thumbnail generated');
                
                // Hide compression status, show success
                compressionStatus.style.display = 'none';
                uploadInfo.style.display = 'block';
                
                uploadInfoText.innerHTML = `
                    <strong>Video Ready!</strong><br>
                    Size: ${fileSizeMB.toFixed(2)} MB (Original Quality)<br>
                    Resolution: ${videoPreview.videoWidth}x${videoPreview.videoHeight}<br>
                    Duration: ${Math.round(videoPreview.duration)}s
                `;
                
                showSuccessMessage('Video ready for upload!');
            };
        };

        reader.onerror = function() {
            compressionStatus.style.display = 'none';
            uploadPlaceholder.style.display = 'flex';
            alert('Error processing video. Please try again.');
        };

        reader.readAsDataURL(processedFile);

    } catch (error) {
        console.error('Error processing video:', error);
        compressionStatus.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        alert('Error processing video: ' + error.message + '\n\nTry using a smaller video or the YouTube method instead.');
    }
});

// Legacy local upload fallback (removed)
// const videoFileInput = document.getElementById('videoFileInput');

// Save Portfolio Item
savePortfolioBtn.addEventListener('click', async () => {
    if (!currentVideoData) {
        alert('Please upload or link a video first');
        return;
    }

    const title = document.getElementById('videoTitle').value;

    if (!title) {
        alert('Please enter a video title');
        return;
    }

    // If using backend (direct upload) and video is base64, upload to server
    if (currentVideoSource === 'direct' && currentVideoData.startsWith('data:')) {
        try {
            showSuccessMessage('Uploading to server...');
            
            // Convert base64 to blob
            const response = await fetch(currentVideoData);
            const blob = await response.blob();
            
            // Create form data
            const formData = new FormData();
            formData.append('video', blob, 'video.mp4');
            formData.append('title', title);
            
            // Upload to backend
            const apiUrl = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';
            const uploadResponse = await fetch(`${apiUrl}/api/upload-video`, {
                method: 'POST',
                body: formData
            });
            
            if (!uploadResponse.ok) {
                throw new Error('Upload failed: ' + uploadResponse.statusText);
            }
            
            const result = await uploadResponse.json();
            
            // Use backend URLs
            currentVideoData = result.videoUrl;
            currentThumbnailData = result.thumbnailUrl;
            
            showSuccessMessage('Video uploaded to server successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading video to server: ' + error.message + '\n\nFalling back to localStorage...');
            // Continue with localStorage save as fallback
        }
    }

    const item = {
        thumbnail: currentThumbnailData || 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Video',
        title: title,
        description: '',
        videoData: currentVideoData,
        videoSource: currentVideoSource, // 'embed' or 'direct'
        category: 'all',
        tags: []
    };

    if (editingPortfolioIndex !== null) {
        portfolioData.portfolio[editingPortfolioIndex] = item;
        showSuccessMessage('Video updated successfully!');
    } else {
        portfolioData.portfolio.push(item);
        showSuccessMessage('Video added successfully!');
    }

    // Save to localStorage
    try {
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        renderPortfolioList();
        portfolioModal.classList.remove('active');
        clearPortfolioForm();
        editingPortfolioIndex = null; // Reset editing index
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert('Storage limit exceeded! The video was uploaded to the server but metadata save failed. Please use YouTube/Vimeo links or clear some portfolio items.');
        } else {
            alert('Error saving video: ' + e.message);
        }
    }
});

// Clear Portfolio Form
function clearPortfolioForm() {
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoLink').value = '';
    document.getElementById('videoLinkPreview').style.display = 'none';
    document.getElementById('videoIframePreview').src = '';
    document.getElementById('videoPreview').style.display = 'none';
    document.getElementById('videoPreview').src = '';
    document.getElementById('uploadPlaceholder').style.display = 'flex';
    document.getElementById('uploadProgress').style.display = 'none';
    if (document.getElementById('uploadInfo')) {
        document.getElementById('uploadInfo').style.display = 'none';
    }
    if (document.getElementById('compressionStatus')) {
        document.getElementById('compressionStatus').style.display = 'none';
    }
    currentVideoData = null;
    currentThumbnailData = null;
    currentVideoSource = 'direct';
    editingPortfolioIndex = null;
    
    // Reset to YouTube method
    currentUploadMethod = 'youtube';
    document.getElementById('youtubeMethod').style.display = 'block';
    document.getElementById('directMethod').style.display = 'none';
    document.getElementById('methodYoutube')?.classList.add('active');
    document.getElementById('methodDirect')?.classList.remove('active');
}

// Render Portfolio List
function renderPortfolioList() {
    const container = document.getElementById('portfolioList');
    
    console.log('Rendering portfolio list:', portfolioData.portfolio.length, 'items');
    
    if (portfolioData.portfolio.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No portfolio items yet. Click "Add New Video" to get started.</p>';
        return;
    }

    const apiUrl = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';

    container.innerHTML = portfolioData.portfolio.map((item, index) => {
        // Fix thumbnail URL to use backend if it's a server path
        const thumbnailUrl = item.thumbnail && item.thumbnail.startsWith('/uploads/') 
            ? apiUrl + item.thumbnail 
            : item.thumbnail;
            
        return `
        <div class="portfolio-item">
            <div class="portfolio-item-image">
                <img src="${thumbnailUrl}" alt="${item.title}" crossorigin="anonymous">
            </div>
            <div class="portfolio-item-content">
                <h4 class="portfolio-item-title">${item.title}</h4>
                <div class="portfolio-item-actions">
                    <button class="btn btn-primary btn-small" onclick="editPortfolio(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deletePortfolio(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Get video size in MB (legacy function)
function getVideoSize(videoData) {
    if (!videoData) return '0 MB';
    if (typeof videoData === 'string' && videoData.startsWith('http')) {
        return 'Cloud';
    }
    const sizeInBytes = videoData.length * 0.75;
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
    return `${sizeInMB} MB`;
}

// Edit Portfolio
window.editPortfolio = function(index) {
    editingPortfolioIndex = index;
    const item = portfolioData.portfolio[index];
    
    // Clear form first
    clearPortfolioForm();
    
    // Set current data
    currentVideoData = item.videoData;
    currentThumbnailData = item.thumbnail;
    currentVideoSource = item.videoSource || 'direct';
    
    // Set title
    document.getElementById('videoTitle').value = item.title;
    
    // Check if it's embed or direct upload
    if (item.videoSource === 'embed' || item.videoData.includes('youtube.com') || item.videoData.includes('vimeo.com')) {
        // YouTube/Vimeo embed
        currentUploadMethod = 'youtube';
        document.getElementById('youtubeMethod').style.display = 'block';
        document.getElementById('directMethod').style.display = 'none';
        document.getElementById('methodYoutube')?.classList.add('active');
        document.getElementById('methodDirect')?.classList.remove('active');
        
        // Set video link
        document.getElementById('videoLink').value = item.videoData;
        
        // Show preview
        const preview = document.getElementById('videoLinkPreview');
        const iframe = document.getElementById('videoIframePreview');
        iframe.src = item.videoData;
        preview.style.display = 'block';
    } else {
        // Direct upload
        currentUploadMethod = 'direct';
        document.getElementById('youtubeMethod').style.display = 'none';
        document.getElementById('directMethod').style.display = 'block';
        document.getElementById('methodYoutube')?.classList.remove('active');
        document.getElementById('methodDirect')?.classList.add('active');
        
        // Show video preview
        const videoPreview = document.getElementById('videoPreview');
        if (videoPreview) {
            // Check if it's a server URL or base64
            const videoSrc = item.videoData.startsWith('/uploads/') 
                ? 'http://localhost:3000' + item.videoData 
                : item.videoData;
            
            videoPreview.src = videoSrc;
            videoPreview.style.display = 'block';
            document.getElementById('uploadPlaceholder').style.display = 'none';
            
            if (document.getElementById('uploadInfo')) {
                document.getElementById('uploadInfo').style.display = 'block';
                document.getElementById('uploadInfoText').innerHTML = `
                    <strong>Current Video</strong><br>
                    Editing existing video
                `;
            }
        }
    }
    
    portfolioModal.classList.add('active');
};

// Delete Portfolio
window.deletePortfolio = async function(index) {
    if (!confirm('Are you sure you want to delete this video? This will also delete it from the server.')) {
        return;
    }
    
    const item = portfolioData.portfolio[index];
    
    // If video is stored on backend server, delete it from there
    if (item.videoData && item.videoData.startsWith('/uploads/')) {
        try {
            // Extract video ID or filename from URL
            // Format: /uploads/videos/1234567890-123456789.mp4
            const videoFilename = item.videoData.split('/').pop();
            
            showSuccessMessage('Deleting from server...');
            
            // Call backend delete API
            const apiUrl = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/videos/delete/${videoFilename}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                console.log('Video deleted from server successfully');
                showSuccessMessage('Video deleted from server!');
            } else {
                console.error('Failed to delete from server:', response.statusText);
                alert('Warning: Failed to delete video from server. Removing from portfolio list only.');
            }
        } catch (error) {
            console.error('Error deleting from server:', error);
            alert('Warning: Could not connect to server. Removing from portfolio list only.');
        }
    }
    
    // Remove from portfolio array
    portfolioData.portfolio.splice(index, 1);
    
    // Save updated data to localStorage
    saveData();
    
    // Re-render the portfolio list
    renderPortfolioList();
    
    showSuccessMessage('Video deleted successfully!');
};

// Save All Button
document.getElementById('saveAllBtn').addEventListener('click', () => {
    collectData();
    saveData();
    updateMainSite();
});

// Update main site with new data
function updateMainSite() {
    // This function would normally update your main index.html
    // For now, we'll just save to localStorage and the main site will read from it
    console.log('Portfolio data saved. Refresh your main site to see changes.');
}

// Initialize
console.log('Admin panel initialized');
loadData();
console.log('Portfolio data loaded:', portfolioData.portfolio.length, 'videos');

// Check localStorage size
function checkStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    const sizeInMB = (total / 1024 / 1024).toFixed(2);
    console.log(`Total localStorage size: ${sizeInMB} MB`);
    return total;
}

checkStorageSize();
