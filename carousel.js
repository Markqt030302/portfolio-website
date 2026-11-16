// Portfolio Carousel Functionality
class PortfolioCarousel {
    constructor() {
        this.carousel = document.getElementById('portfolioCarousel');
        this.grid = document.querySelector('.portfolio-grid');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.indicatorsContainer = document.getElementById('carouselIndicators');
        
        this.currentIndex = 0;
        this.itemsPerView = this.getItemsPerView();
        this.totalItems = 0;
        this.totalPages = 0;
        
        this.init();
    }
    
    init() {
        // Wait for items to load
        setTimeout(() => {
            this.updateCarousel();
            this.createIndicators();
            this.attachEventListeners();
            
            // Update on window resize
            window.addEventListener('resize', () => {
                this.itemsPerView = this.getItemsPerView();
                this.updateCarousel();
                this.createIndicators();
            });
        }, 500);
    }
    
    getItemsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }
    
    updateCarousel() {
        if (!this.grid) return;
        
        const items = this.grid.querySelectorAll('.portfolio-item');
        this.totalItems = items.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerView);
        
        // Calculate offset
        const itemWidth = items[0]?.offsetWidth || 0;
        const gap = 32; // 2rem
        const offset = -(this.currentIndex * this.itemsPerView * (itemWidth + gap));
        
        this.grid.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        this.updateButtons();
        this.updateIndicators();
    }
    
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.style.cursor = this.currentIndex === 0 ? 'not-allowed' : 'pointer';
        }
        
        if (this.nextBtn) {
            const isLastPage = this.currentIndex >= this.totalPages - 1;
            this.nextBtn.disabled = isLastPage;
            this.nextBtn.style.opacity = isLastPage ? '0.5' : '1';
            this.nextBtn.style.cursor = isLastPage ? 'not-allowed' : 'pointer';
        }
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === this.currentIndex) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                this.goToPage(i);
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.totalPages) return;
        this.currentIndex = pageIndex;
        this.updateCarousel();
    }
    
    next() {
        if (this.currentIndex < this.totalPages - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (this.carousel) {
            this.carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            this.carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) this.next();
            if (touchEndX > touchStartX + 50) this.prev();
        };
        
        this.handleSwipe = handleSwipe;
    }
}

// Initialize carousel when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioCarousel();
    });
} else {
    new PortfolioCarousel();
}
