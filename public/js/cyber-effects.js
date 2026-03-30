// Minimal Cyber Effects for Fighting Smart Cyber
// Stripped down from the original gimmicky version

// Smooth counter animation for stat numbers
class SmoothCounter {
    constructor() {
        this.elements = document.querySelectorAll('[data-count]');
        if (this.elements.length === 0) return;
        this.observe();
    }

    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.elements.forEach(el => observer.observe(el));
    }

    animate(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 1500;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(step);
            else element.textContent = target;
        };

        requestAnimationFrame(step);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new SmoothCounter();
});
