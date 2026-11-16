// Load portfolio data from admin panel
(function() {
    const portfolioData = localStorage.getItem('portfolioData');
    if (!portfolioData) return;

    const data = JSON.parse(portfolioData);

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

    // Update Portfolio
    if (data.portfolio && data.portfolio.length > 0) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = data.portfolio.map((item, index) => `
                <div class="portfolio-item" data-category="all">
                    <div class="portfolio-card" data-video-index="${index}">
                        <div class="portfolio-thumbnail">
                            <img src="${item.thumbnail.startsWith('/uploads/') ? 'http://localhost:3000' + item.thumbnail : item.thumbnail}" alt="${item.title}">
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <h3>${item.title}</h3>
                        </div>
                    </div>
                </div>
            `).join('');

            // Re-attach video modal handlers
            document.querySelectorAll('.portfolio-card').forEach((card, index) => {
                card.addEventListener('click', () => {
                    const modal = document.getElementById('videoModal');
                    const videoContainer = modal.querySelector('.video-container');
                    const item = data.portfolio[index];
                    
                    // Check if it's an embed or direct upload
                    if (item.videoSource === 'embed' || item.videoData.includes('youtube.com') || item.videoData.includes('vimeo.com') || item.videoData.includes('player.vimeo.com')) {
                        // Embedded video (YouTube/Vimeo)
                        videoContainer.innerHTML = `
                            <iframe src="${item.videoData}" frameborder="0" allowfullscreen style="width: 100%; height: 100%;"></iframe>
                        `;
                    } else {
                        // Direct upload video (server URL or base64)
                        // If it's a server path, prepend the server URL
                        const videoSrc = item.videoData.startsWith('/uploads/') 
                            ? `http://localhost:3000${item.videoData}` 
                            : item.videoData;
                        
                        // Detect file extension for MIME type
                        let mimeType = 'video/mp4';
                        if (videoSrc.includes('.webm')) mimeType = 'video/webm';
                        else if (videoSrc.includes('.mov')) mimeType = 'video/quicktime';
                        else if (videoSrc.includes('.avi')) mimeType = 'video/x-msvideo';
                        else if (videoSrc.includes('.mkv')) mimeType = 'video/x-matroska';
                        
                        videoContainer.innerHTML = `
                            <video controls autoplay style="width: 100%; height: 100%; object-fit: contain; background: #000;">
                                <source src="${videoSrc}" type="${mimeType}">
                                <source src="${videoSrc}">
                                Your browser does not support the video tag.
                            </video>
                        `;
                        
                        // Force video to load
                        const video = videoContainer.querySelector('video');
                        video.load();
                    }
                    
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });
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
})();
