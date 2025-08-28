// Modern Chess Academy Website JavaScript
class ChessAcademyApp {
    constructor() {
        // Removed settings-related properties as they are now handled by universal-settings.js
        this.mobileMenuOpen = false;
        this.settingsPanelOpen = false; // This property is still used for the panel state, but its opening/closing is handled by universal-settings.js
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        // Removed initTheme() as it's handled by universal-settings.js
        this.initScrollAnimations();
        this.initCounters();
        this.initMobileMenu();
        // Removed initSettingsPanel() as it's handled by universal-settings.js
        this.initFormHandling();
        this.initParallaxEffects();
        // Removed initEnhancedSettings() as it's handled by universal-settings.js
        this.initSoundEffects(); // Sound effects are still managed here, but soundEnabled is from universal-settings.js
        // Removed applyUserPreferences() as it's handled by universal-settings.js
        
        console.log('🚀 Chess Academy App initialized successfully!');
    }
    
    setupEventListeners() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
        
        // Window events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }
    
    onDOMReady() {
        // Add loading class to elements
        const elements = document.querySelectorAll('.card, .stat-item, .form-container');
        elements.forEach(el => el.classList.add('loading'));
        
        // Remove loading class with delay
        setTimeout(() => {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.remove('loading');
                    el.classList.add('loaded');
                }, index * 100);
            });
        }, 300);
    }
    
    // Removed redundant Enhanced Settings Functions as they are now handled by universal-settings.js
    
    initSoundEffects() {
        // Create audio context for sound effects
        this.audioContext = null;
        
        // Initialize audio context on first user interaction
        document.addEventListener('click', () => {
            // Check soundEnabled from localStorage directly or via a global setting from universal-settings.js
            if (!this.audioContext && localStorage.getItem('sound') === 'true') {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    console.warn('Web Audio API not supported');
                }
            }
        }, { once: true });
    }
    
    playSound(type) {
        if (localStorage.getItem('sound') !== 'true' || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Different sounds for different types
            switch (type) {
                case 'click':
                    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
                    break;
                case 'success':
                    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.2);
                    break;
                case 'error':
                    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                    break;
            }
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.warn('Sound generation failed:', e);
        }
    }
    
    // Removed resetAllSettings() and updateAllToggleStates() as they are handled by universal-settings.js
    
    // Mobile Menu
    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenuOpen = !this.mobileMenuOpen;
                navLinks.classList.toggle('open', this.mobileMenuOpen);
                mobileMenuBtn.innerHTML = this.mobileMenuOpen ? '✕' : '☰';
            });
            
            // Close menu when clicking on a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.mobileMenuOpen = false;
                    navLinks.classList.remove('open');
                    mobileMenuBtn.innerHTML = '☰';
                });
            });
        }
    }
    
    // Removed initSettingsPanel() as it's handled by universal-settings.js
    
    // Scroll Animations
    initScrollAnimations() {
        // Only enable if animations are enabled (checked via 'no-animations' class on html element)
        if (document.documentElement.classList.contains('no-animations')) {
            document.querySelectorAll('.card, .stat-item, .section-header').forEach(el => {
                el.classList.remove('reveal');
                el.classList.add('active');
            });
            return;
        }
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a small delay to prevent flickering
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, 50);
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        const elements = document.querySelectorAll('.card, .stat-item, .section-header');
        elements.forEach((el, index) => {
            el.classList.add('reveal');
            // Stagger observation to prevent all elements triggering at once
            setTimeout(() => {
                observer.observe(el);
            }, index * 50);
        });
    }
    
    // Animated Counters (Live Counter Fix)
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Keep threshold at 0.5 for now, can adjust if needed
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        if (isNaN(target)) { // Handle cases where data-target is missing or invalid
            console.warn('Invalid data-target for counter:', element);
            element.textContent = element.textContent || '0'; // Fallback to existing text or '0'
            return;
        }

        const duration = 2000; // milliseconds
        const frameDuration = 1000 / 60; // ~60 frames per second
        const totalFrames = duration / frameDuration;
        const increment = target / totalFrames;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, frameDuration);
    }
    
    // Form Handling
    initFormHandling() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }
    
    handleFormSubmit(form) {
        const formData = new FormData(form);
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Submit form via fetch
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) { // Check if response was successful (2xx status)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                // If not JSON, assume success and return a default success object
                return { success: true, message: 'Message sent successfully!' };
            }
        })
        .then(data => {
            if (data.success) {
                this.showNotification(data.message, 'success');
                form.reset();
            } else {
                this.showNotification(data.message || 'An unknown error occurred.', 'error');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            this.showNotification(`There was an error sending your message: ${error.message}. Please try again.`, 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : 'var(--accent-primary)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        const notificationEl = notification.firstElementChild;
        
        // Animate in
        setTimeout(() => {
            notificationEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notificationEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Parallax Effects
    initParallaxEffects() {
        // Only enable parallax if animations are enabled and not on mobile
        if (document.documentElement.classList.contains('no-animations') || window.innerWidth <= 768) {
            // Ensure elements are in their final state if parallax is disabled
            document.querySelectorAll('.hero, .floating-element').forEach(el => {
                el.style.transform = '';
            });
            return;
        }
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking && !document.documentElement.classList.contains('no-animations')) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateParallax() {
        // Skip parallax on mobile or if animations disabled
        if (document.documentElement.classList.contains('no-animations') || window.innerWidth <= 768) {
            // Ensure elements are in their final state if parallax is disabled
            document.querySelectorAll('.hero, .floating-element').forEach(el => {
                el.style.transform = '';
            });
            return;
        }
        
        const scrolled = window.pageYOffset;
        
        // Reduced parallax intensity to prevent weird scrolling
        const rate = scrolled * 0.2;
        
        // Parallax for hero backgrounds only
        const heroes = document.querySelectorAll('.hero');
        heroes.forEach(hero => {
            // Gentler parallax effect
            hero.style.transform = `translateY(${rate * 0.1}px)`;
        });
        
        // Floating elements with reduced movement
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            const xPos = Math.sin(scrolled * 0.0005 + index) * 10;
            element.style.transform = `translateY(${yPos}px) translateX(${xPos}px)`;
        });
    }
    
    // Event Handlers
    handleScroll() {
        // Header background change on scroll
        const header = document.querySelector('header');
        const settingsToggle = document.querySelector('.settings-toggle');
        
        if (header) {
            // The header is always blurred as per the design, no change needed based on scroll
            // header.style.background = 'var(--bg-glass)';
            // header.style.backdropFilter = 'blur(20px)';
        }
        
        // Settings button position adjustment on scroll
        if (settingsToggle) {
            if (window.scrollY > 200) {
                settingsToggle.classList.add('scrolled');
            } else {
                settingsToggle.classList.remove('scrolled');
            }
        }
    }
    
    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
            this.mobileMenuOpen = false;
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (navLinks) navLinks.classList.remove('open');
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '☰';
        }
    }
}

// Testimonials Slider
class TestimonialsSlider {
    constructor(container) {
        this.container = container;
        this.testimonials = container.querySelectorAll('.testimonial');
        this.dots = container.querySelectorAll('.dot');
        this.currentSlide = 0;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        if (this.testimonials.length > 0) {
            this.bindEvents();
            this.startAutoSlide();
            this.showSlide(0);
        }
    }
    
    showSlide(index) {
        // Hide all testimonials
        this.testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
            testimonial.classList.remove('active');
        });
        
        // Remove active class from dots
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current testimonial
        if (this.testimonials[index]) {
            this.testimonials[index].style.display = 'block';
            this.testimonials[index].classList.add('active');
        }
        
        // Activate current dot
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.testimonials.length;
        this.showSlide(next);
    }
    
    bindEvents() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlide(index);
                this.restartAutoSlide();
            });
        });
        
        // Pause auto-slide on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    startAutoSlide() {
        this.intervalId = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoSlide() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    window.chessApp = new ChessAcademyApp();
    
    // Initialize testimonials slider
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
        new TestimonialsSlider(testimonialsContainer);
    }
    
    // Add click sound to buttons
    document.querySelectorAll('.btn, .card, .nav-links a').forEach(element => {
        element.addEventListener('click', (e) => {
            // Check soundEnabled from localStorage directly
            if (localStorage.getItem('sound') === 'true' && window.chessApp) {
                window.chessApp.playSound('click');
            }
        });
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChessAcademyApp, TestimonialsSlider };
}
