// Advanced Animations and Effects for Fighting Smart Cyber

// Particle System for Hero Section
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 60;
        this.connectionDistance = 150;

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
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 168, 255, 0.6)';
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
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

// Scroll Animation Observer
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .mission-card');
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Mouse tracking for interactive effects
class MouseTracker {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Parallax effect for hero elements
            const hero = document.querySelector('.hero');
            if (hero) {
                const moveX = (this.mouseX - window.innerWidth / 2) / 50;
                const moveY = (this.mouseY - window.innerHeight / 2) / 50;

                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            }
        });
    }
}

// Card tilt effect
class CardTiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.mission-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// Smooth scroll progress indicator
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
            height: 3px;
            background: linear-gradient(90deg, #00a8ff, #00d4ff);
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 2px 10px rgba(0, 168, 255, 0.5);
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

// Button ripple effect
class ButtonRipple {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    animation: ripple-animation 0.6s ease-out;
                `;

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation to CSS if not present
        if (!document.getElementById('ripple-animation-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes ripple-animation {
                    from {
                        transform: scale(0);
                        opacity: 1;
                    }
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Navbar background on scroll
class NavbarEffect {
    constructor() {
        this.header = document.querySelector('header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.header.style.background = 'rgba(0, 0, 0, 0.95)';
                this.header.style.backdropFilter = 'blur(20px)';
            } else {
                this.header.style.background = 'var(--dark)';
                this.header.style.backdropFilter = 'none';
            }
        });
    }
}

// Full-page background particle system (subtle, behind all content)
class BackgroundParticles {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'bg-particles';
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;';
        document.body.prepend(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 35;
        this.connectionDistance = 180;
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.connectionDistance) {
                    const opacity = (1 - dist / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = 'rgba(0, 212, 255, ' + opacity + ')';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw particles
        for (let p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 168, 255, 0.35)';
            this.ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize full-page background particles
    new BackgroundParticles();

    // Initialize hero particle system
    new ParticleSystem('particle-canvas');

    // Initialize scroll animations
    new ScrollAnimator();

    // Initialize card tilt effects
    new CardTiltEffect();

    // Initialize scroll progress bar
    new ScrollProgress();

    // Initialize button ripple effects
    new ButtonRipple();

    // Initialize navbar effects
    new NavbarEffect();

    console.log('Fighting Smart Cyber - Advanced animations loaded');
});
