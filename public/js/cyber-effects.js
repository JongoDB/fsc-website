// Cyber/Futuristic Effects for Fighting Smart Cyber
// Inspired by NextUI, ShadCN, and cyberpunk aesthetics

// Scanline Overlay Effect
class ScanlineEffect {
    constructor() {
        this.createScanline();
    }

    createScanline() {
        const scanline = document.createElement('div');
        scanline.className = 'scanline-overlay';
        document.body.appendChild(scanline);
    }
}

// Cyber Grid Background
class CyberGrid {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const grid = document.createElement('div');
            grid.className = 'cyber-grid';
            element.style.position = 'relative';
            element.insertBefore(grid, element.firstChild);
        });
    }
}

// Data Stream Animation
class DataStreamEffect {
    constructor(container) {
        this.container = container;
        this.streams = [];
        this.maxStreams = 8;
        this.init();
    }

    init() {
        setInterval(() => {
            if (this.streams.length < this.maxStreams) {
                this.createStream();
            }
        }, 800);
    }

    createStream() {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.left = Math.random() * 100 + '%';
        stream.style.animationDuration = (Math.random() * 2 + 2) + 's';
        stream.style.animationDelay = Math.random() * 1 + 's';

        this.container.appendChild(stream);
        this.streams.push(stream);

        setTimeout(() => {
            stream.remove();
            this.streams = this.streams.filter(s => s !== stream);
        }, 5000);
    }
}

// Terminal Typing Effect
class TerminalTyping {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.element.classList.add('terminal-cursor');
        this.type();
    }

    type() {
        if (this.currentIndex < this.text.length) {
            const currentText = this.element.textContent.replace('▊', '');
            this.element.textContent = currentText + this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            setTimeout(() => {
                this.element.classList.remove('terminal-cursor');
            }, 500);
        }
    }
}

// Glitch Effect on Hover
class GlitchHover {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            element.classList.add('glitch-text');
        });
    }
}

// Neon Pulse Effect
class NeonPulse {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            element.classList.add('neon-text');
        });
    }
}

// Cyber Stats Counter with Animation
class CyberCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.current = 0;
        this.increment = this.target / (this.duration / 16);
        this.hasAnimated = false;
        this.observe();
    }

    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animate();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animate() {
        const step = () => {
            this.current += this.increment;
            if (this.current < this.target) {
                this.element.textContent = Math.floor(this.current);
                requestAnimationFrame(step);
            } else {
                this.element.textContent = this.target;
            }
        };
        step();
    }
}

// Matrix Rain Effect (subtle)
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.chars = '01';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const hero = this.canvas.closest('.hero');
        if (hero) {
            this.canvas.width = hero.offsetWidth;
            this.canvas.height = hero.offsetHeight;
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = Array(this.columns).fill(1);
        }
    }

    init() {
        this.drops = Array(this.columns).fill(1);
    }

    animate() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw characters
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // Reset drop randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Hexagonal Pattern Overlay
class HexPattern {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const pattern = document.createElement('div');
            pattern.className = 'hex-pattern';
            element.style.position = 'relative';
            element.insertBefore(pattern, element.firstChild);
        });
    }
}

// Holographic Card Effect
class HolographicEffect {
    constructor(selector) {
        this.cards = document.querySelectorAll(selector);
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

                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;

                card.style.setProperty('--mouse-x', percentX);
                card.style.setProperty('--mouse-y', percentY);

                const gradient = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(0, 212, 255, 0.2) 0%,
                        transparent 50%
                    )
                `;

                const overlay = card.querySelector('.holographic-overlay') ||
                               this.createOverlay(card);

                overlay.style.background = gradient;
            });

            card.addEventListener('mouseleave', () => {
                const overlay = card.querySelector('.holographic-overlay');
                if (overlay) {
                    overlay.style.background = 'transparent';
                }
            });
        });
    }

    createOverlay(card) {
        const overlay = document.createElement('div');
        overlay.className = 'holographic-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            border-radius: inherit;
            transition: background 0.3s ease;
        `;
        card.appendChild(overlay);
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        return overlay;
    }
}

// Cyber Divider Animation
class CyberDivider {
    constructor() {
        this.createDividers();
    }

    createDividers() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (index < sections.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'cyber-divider';
                section.parentNode.insertBefore(divider, section.nextSibling);
            }
        });
    }
}

// Initialize all cyber effects
document.addEventListener('DOMContentLoaded', () => {
    // Add scanline effect
    new ScanlineEffect();

    // Add cyber grid to hero
    new CyberGrid('.hero');

    // Add data streams to hero
    const hero = document.querySelector('.hero');
    if (hero) {
        new DataStreamEffect(hero);
    }

    // Add hex pattern to dark sections
    new HexPattern('.dark-section');

    // Add holographic effect to cards
    new HolographicEffect('.mission-card');

    console.log('Fighting Smart Cyber - Cyber effects loaded');
});
