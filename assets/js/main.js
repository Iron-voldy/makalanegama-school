/**
 * Makalanegama School Website - Main JavaScript
 * Updated to use admin backend API instead of Telegram
 */

// Global variables
let isLoading = true;
let navbar, backToTopBtn, loadingScreen;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeLoadingScreen();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeInteractiveElements();
    initializeGallery();
    initializeCalendar();
    
    // Static website - no dynamic content loading needed
});

/**
 * Initialize DOM elements
 */
function initializeElements() {
    navbar = document.querySelector('.custom-navbar');
    backToTopBtn = document.getElementById('backToTop');
    loadingScreen = document.getElementById('loading-screen');
}

/**
 * Loading Screen Animation
 */
function initializeLoadingScreen() {
    if (!loadingScreen) return;
    
    // Simulate loading progress
    const progressFill = document.querySelector('.progress-fill');
    const schoolLogo = document.querySelector('.school-logo img');
    
    // Animate logo pulse
    if (typeof gsap !== 'undefined' && schoolLogo) {
        gsap.to(schoolLogo, {
            scale: 1.1,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }
    
    // Progress bar animation
    if (typeof gsap !== 'undefined' && progressFill) {
        gsap.to(progressFill, {
            width: "100%",
            duration: 3,
            ease: "power2.out",
            onComplete: () => {
                hideLoadingScreen();
            }
        });
    } else {
        // Fallback without GSAP
        setTimeout(() => {
            hideLoadingScreen();
        }, 3000);
    }
}

function hideLoadingScreen() {
    if (!loadingScreen) return;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                loadingScreen.style.display = 'none';
                isLoading = false;
                animateHeroSection();
            }
        });
    } else {
        // Fallback without GSAP
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
        }, 500);
    }
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    if (!navbar) return;
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 100;
        navbar.classList.toggle('scrolled', scrolled);
    });
    
    // Enhanced mobile navigation
    initializeMobileNavigation();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Mobile menu close on link click (exclude dropdown toggles)
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

/**
 * Enhanced Mobile Navigation
 */
function initializeMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const dropdownToggles = document.querySelectorAll('.nav-link.dropdown-toggle');
    
    // Let Bootstrap handle dropdowns in all screen sizes
    // No custom mobile dropdown code needed
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            const isInsideNav = navbar.contains(e.target);
            const isNavOpen = navbarCollapse && navbarCollapse.classList.contains('show');
            
            if (!isInsideNav && isNavOpen) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
    
    // Reset dropdown styles on window resize - simplified
    window.addEventListener('resize', function() {
        // Clear any custom styles to let Bootstrap handle everything
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.maxHeight = '';
            menu.style.overflow = '';
            menu.style.transition = '';
            menu.style.opacity = '';
        });
    });
    
    // Enhance navbar toggler
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Add animation class
            this.classList.toggle('active', !isExpanded);
            
            // Update aria-label for accessibility
            this.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
        });
    }
    
    // Close mobile menu when scrolling
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        if (window.innerWidth < 992) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isNavOpen = navbarCollapse && navbarCollapse.classList.contains('show');
            
            // Close nav on scroll down
            if (scrollTop > lastScrollTop && scrollTop > 100 && isNavOpen) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
            
            lastScrollTop = scrollTop;
        }
    });
}

/**
 * Scroll effects and back to top button
 */
function initializeScrollEffects() {
    // Back to top button
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 500;
            backToTopBtn.classList.toggle('visible', scrolled);
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effect for hero background
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
}

/**
 * GSAP Animations (if available)
 */
function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Register ScrollTrigger plugin only if available
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Animate sections on scroll only if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
        const sections = document.querySelectorAll('section:not(.hero-section)');
        sections.forEach(section => {
            gsap.from(section.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
    
    // Animate cards on hover
    const cards = document.querySelectorAll('.quick-link-card, .achievement-card, .news-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Animate stats counter only if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
        const statsNumbers = document.querySelectorAll('.stat-number');
        statsNumbers.forEach(stat => {
            const finalValue = stat.textContent.replace('+', '');
            if (!isNaN(finalValue)) {
                gsap.from(stat, {
                    textContent: 0,
                    duration: 2,
                    ease: "power2.out",
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: stat,
                        start: "top 80%"
                    },
                    onUpdate: function() {
                        stat.textContent = Math.ceil(this.targets()[0].textContent) + '+';
                    }
                });
            }
        });
    }
}

/**
 * Hero section animations
 */
function animateHeroSection() {
    if (typeof gsap === 'undefined') return;
    
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
        // Animate hero content elements
        const tl = gsap.timeline();
        
        tl.from('.hero-badge', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        })
        .from('.hero-title', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5")
        .from('.hero-subtitle-sinhala', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.7")
        .from('.hero-description', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        .from('.hero-stats .stat-item', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.5")
        .from('.hero-buttons .btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4");
    }
    
    if (heroVisual) {
        // Animate hero visual
        gsap.from('.school-building-img', {
            x: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.5
        });
        
        // Animate floating cards
        gsap.from('.floating-card', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "back.out(1.7)",
            delay: 1
        });
    }
}

/**
 * Interactive elements
 */
function initializeInteractiveElements() {
    // Animated buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
    });
}

/**
 * Gallery functionality
 */
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-image');
            if (img) {
                createLightbox(img.src);
            }
        });
    });
}

/**
 * Create lightbox for gallery images
 */
function createLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    lightbox.innerHTML = `
        <div class="lightbox-content" style="position: relative; max-width: 90%; max-height: 90%;">
            <img src="${imageSrc}" alt="Gallery Image" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            <button class="lightbox-close" style="position: absolute; top: -40px; right: 0; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox
    const closeLightbox = () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
    };
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

/**
 * Calendar functionality
 */
function initializeCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const calendarHeader = document.querySelector('.calendar-header h4');
    const prevBtn = document.querySelector('.btn-nav.prev');
    const nextBtn = document.querySelector('.btn-nav.next');
    
    if (!calendarGrid) return;
    
    let currentDate = new Date();
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update header
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        if (calendarHeader) {
            calendarHeader.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Clear existing days (keep headers)
        const existingDays = calendarGrid.querySelectorAll('.calendar-day:not(.header)');
        existingDays.forEach(day => day.remove());
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Mark event days (example: 25th)
            if (day === 25) {
                dayElement.classList.add('event-day');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // Initial render
    renderCalendar();
}

/**
 * Static content - no dynamic loading needed
 * All content is manually added to HTML files
 */
function loadDynamicContent() {
    // Static website - no API calls needed
    console.log('Static website loaded successfully');
}

/**
 * Static website - all content manually added to HTML
 * No API calls needed
 */

/**
 * Static website - all display functions removed
 * Content is manually added to HTML files
 */

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

/**
 * Format time for display
 */
function formatTime(timeString) {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

/**
 * Truncate text to specified length
 */
function truncateText(text, length) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
}

/**
 * Handle contact form submission
 */
async function handleContactForm(formData) {
    try {
        const response = await fetch('/api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.error || 'Failed to send message' };
        }
    } catch (error) {
        console.error('Contact form error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other files
window.MakalanegamaSchool = {
    handleContactForm,
    formatDate,
    formatTime,
    truncateText
};