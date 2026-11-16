// ===== Navigation ===== 
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate menu toggle
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(45deg) translate(7px, 7px)' 
        : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(-45deg) translate(7px, -7px)' 
        : 'none';
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== Smooth Scrolling =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Portfolio Filtering =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all') {
                item.classList.remove('hide');
                item.style.display = 'block';
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hide');
                    item.style.display = 'none';
                }
            }
        });
    });
});

// ===== Video Modal =====
const modal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const closeModal = document.querySelector('.close-modal');
const portfolioCards = document.querySelectorAll('.portfolio-card');

// Open modal with video - handled by portfolio-loader.js if data exists
portfolioCards.forEach((card, index) => {
    // This will be overridden by portfolio-loader.js if portfolio data exists
    card.addEventListener('click', () => {
        console.log('No portfolio data loaded. Please add videos via admin panel.');
    });
});

// Close modal
closeModal.addEventListener('click', closeVideoModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeVideoModal();
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeVideoModal();
    }
});

function closeVideoModal() {
    modal.classList.remove('active');
    const video = modal.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    document.body.style.overflow = 'auto';
}

// ===== Contact Form - REMOVED =====
// Contact form removed - displaying contact info only

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.portfolio-card, .skill-category, .about-text, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===== Smooth appearance on page load =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ===== Typing Effect for Hero (Optional Enhancement) =====
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let i = 0;
    
    setTimeout(() => {
        const typeWriter = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        typeWriter();
    }, 1200);
}

// ===== Stats Counter Animation =====
const stats = document.querySelectorAll('.stat-number');

const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 30);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
};

// Trigger stats animation when about section is visible
const aboutSection = document.querySelector('.about');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 600);
    }
});

// ===== Cursor Effect (Optional Enhancement) =====
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-effect');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
};

// Uncomment to enable cursor effect
// createCursorEffect();

console.log('Portfolio website loaded successfully! 🎬');
