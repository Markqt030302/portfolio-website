// Load portfolio data from admin panel
(function() {
    // Get API URL from config
    const API_URL = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';
    
    // Function to load videos from server API
    async function loadVideosFromServer() {
        try {
            const response = await fetch(`${API_URL}/api/videos`);
            if (!response.ok) throw new Error('Failed to fetch videos');
            const data = await response.json();
            return data.videos || [];
        } catch (error) {
            console.error('Error loading videos from server:', error);
            return [];
        }
    }
    
    // Function to render portfolio videos
    function renderPortfolio(videos) {
        if (!videos || videos.length === 0) return;
        
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;
        
        portfolioGrid.innerHTML = videos.map((video, index) => {
            const thumbnailUrl = video.thumbnail_url 
                ? (video.thumbnail_url.startsWith('/uploads/') ? API_URL + video.thumbnail_url : video.thumbnail_url)
                : 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Video';
                
            return `
                <div class="portfolio-item" data-category="all">
                    <div class="portfolio-card" data-video-index="${index}">
                        <div class="portfolio-thumbnail">
                            <img src="${thumbnailUrl}" alt="${video.title}" crossorigin="anonymous">
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <h3>${video.title}</h3>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Attach click handlers for video modal
        document.querySelectorAll('.portfolio-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                const modal = document.getElementById('videoModal');
                const videoContainer = modal.querySelector('.video-container');
                const video = videos[index];
                
                // Build video URL
                const videoUrl = video.video_url.startsWith('/uploads/') 
                    ? API_URL + video.video_url 
                    : video.video_url;
                
                // Determine if it's an embed or direct video
                if (video.upload_type === 'embed' || videoUrl.includes('youtube.com') || videoUrl.includes('vimeo.com')) {
                    // Embedded video
                    videoContainer.innerHTML = `
                        <iframe src="${videoUrl}" frameborder="0" allowfullscreen style="width: 100%; height: 100%;"></iframe>
                    `;
                } else {
                    // Direct upload video
                    videoContainer.innerHTML = `
                        <video controls autoplay style="width: 100%; height: 100%; object-fit: contain; background: #000;" crossorigin="anonymous">
                            <source src="${videoUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    `;
                    
                    const videoEl = videoContainer.querySelector('video');
                    videoEl.load();
                }
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Reinitialize carousel after a short delay
        setTimeout(() => {
            if (typeof PortfolioCarousel !== 'undefined') {
                new PortfolioCarousel();
            }
        }, 200);
    }
    
    // Load videos from server
    loadVideosFromServer().then(videos => {
        if (videos.length > 0) {
            renderPortfolio(videos);
            console.log(`Loaded ${videos.length} videos from server`);
        }
    });
    
    // Keep backend awake by pinging every 5 minutes
    setInterval(() => {
        fetch(`${API_URL}/api/health`).catch(() => {
            console.log('Backend ping failed (this is normal if offline)');
        });
    }, 5 * 60 * 1000); // 5 minutes
    console.log('⏰ Backend keep-alive enabled (pings every 5 minutes)');
    
    // Load profile, skills, and contact data from backend API
    async function loadProfileDataFromServer() {
        try {
            console.log('🔄 Loading profile data from backend...', API_URL);
            const response = await fetch(`${API_URL}/api/get-portfolio`);
            if (!response.ok) throw new Error('Failed to fetch profile data');
            
            const result = await response.json();
            const serverData = result.data;
            
            console.log('📦 Server data received:', serverData);
            
            if (serverData && Object.keys(serverData).length > 0) {
                console.log('✅ Using server data');
                // Use server data
                return {
                    profile: serverData.profile || null,
                    skills: serverData.skills || null,
                    contact: serverData.contact || null
                };
            } else {
                console.log('⚠️ Server data is empty');
            }
        } catch (error) {
            console.error('❌ Error loading profile data from server:', error);
        }
        return null;
    }
    
    // Try to load from server first, then fall back to localStorage
    loadProfileDataFromServer().then(serverData => {
        let data = null;
        
        if (serverData && serverData.profile) {
            // Use server data
            data = serverData;
            console.log('Loaded profile data from server');
        } else {
            // Fall back to localStorage
            const portfolioData = localStorage.getItem('portfolioData');
            if (portfolioData) {
                data = JSON.parse(portfolioData);
                console.log('Loaded profile data from localStorage');
            }
        }
        
        if (!data) return;
        
        updateProfileUI(data);
    });
    
    // Function to update profile UI
    function updateProfileUI(data) {
        // Update Profile
        if (data.profile) {
            // Update name in navigation
            const brandText = document.querySelector('.brand-text');
            if (brandText) brandText.textContent = data.profile.name;

            // Update hero section
            const heroLines = document.querySelectorAll('.title-line');
            if (heroLines.length >= 2) {
                heroLines[0].textContent = data.profile.jobTitle;
                heroLines[1].textContent = data.profile.tagline;
            }

            // Update about section
            const aboutParagraphs = document.querySelectorAll('.about-text p');
            if (aboutParagraphs.length >= 2) {
                aboutParagraphs[0].textContent = data.profile.aboutPara1;
                aboutParagraphs[1].textContent = data.profile.aboutPara2;
            }

            // Update profile photo
            if (data.profile.profilePhoto) {
                const profileImg = document.querySelector('.about-image img');
                if (profileImg) profileImg.src = data.profile.profilePhoto;
            }
        }

        // Update Skills - AI Tools only
        if (data.skills) {
            const skillList = document.querySelector('.skill-list');
            if (skillList && data.skills.ai) {
                const skills = data.skills.ai.split('\n').filter(skill => skill.trim());
                skillList.innerHTML = skills.map(skill => `<li>${skill.trim()}</li>`).join('');
            }
        }

        // Update Contact
        if (data.contact) {
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            if (emailLinks.length > 0) {
                emailLinks[0].href = `mailto:${data.contact.email}`;
                emailLinks[0].textContent = data.contact.email;
            }

            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            if (phoneLinks.length > 0) {
                phoneLinks[0].href = `tel:${data.contact.phone}`;
                phoneLinks[0].textContent = data.contact.phone;
            }

            const locationText = document.querySelector('.contact-details p');
            if (locationText) locationText.textContent = data.contact.location;
        }

        console.log('Portfolio data loaded successfully!');
    }
})();
