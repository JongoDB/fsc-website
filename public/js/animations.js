// Modern Animations for Fighting Smart Cyber

// Particle System for Hero Section (refined - fewer particles, subtler)
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 40;
        this.connectionDistance = 120;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        const hero = this.canvas.closest('.hero');
        if (hero) {
            this.canvas.width = hero.offsetWidth;
            this.canvas.height = hero.offsetHeight;
        }
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 168, 255, 0.3)';
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    update() {
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        }
    }

    animate() {
        if (!this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        for (let particle of this.particles) {
            this.drawParticle(particle);
        }
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

// Scroll Animation Observer with stagger support
class ScrollAnimator {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all scroll-animated elements
        document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .stagger-children').forEach(el => {
            observer.observe(el);
        });

        // Observe mission cards individually for non-stagger fallback
        document.querySelectorAll('.mission-card:not(.stagger-children .mission-card)').forEach(el => {
            observer.observe(el);
        });
    }
}

// Smooth scroll progress indicator (subtle top bar)
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.updateProgress();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, #00a8ff, #00d4ff);
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }

    updateProgress() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const progressBar = document.getElementById('scroll-progress');
            if (progressBar) {
                progressBar.style.width = scrolled + '%';
            }
        });
    }
}

// Navbar background transition on scroll
class NavbarEffect {
    constructor() {
        this.header = document.querySelector('header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.style.background = 'rgba(0, 0, 0, 0.95)';
                this.header.style.backdropFilter = 'blur(24px)';
            } else {
                this.header.style.background = 'rgba(0, 0, 0, 0.8)';
                this.header.style.backdropFilter = 'blur(20px)';
            }
        });
    }
}

// Magnetic hover effect for cards (subtle, refined)
class CardHoverEffect {
    constructor() {
        this.cards = document.querySelectorAll('.mission-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
                card.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(0, 168, 255, 0.04), transparent 40%), var(--white)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero particle system
    new ParticleSystem('particle-canvas');

    // Initialize scroll animations
    new ScrollAnimator();

    // Initialize scroll progress bar
    new ScrollProgress();

    // Initialize navbar effects
    new NavbarEffect();

    // Initialize card hover effect
    new CardHoverEffect();
});
