// Scroll-based frame animation controller
// Preloads frames and swaps them based on scroll position within a target element

(function() {
    const container = document.getElementById('scroll-animation');
    if (!container) return;

    const canvas = document.getElementById('scroll-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const FRAME_COUNT = 60;
    const frames = [];
    let loadedCount = 0;
    let currentFrame = 0;

    // Set canvas size
    canvas.width = 1280;
    canvas.height = 720;

    // Preload all frames
    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const num = String(i).padStart(3, '0');
        img.src = '/images/scroll-frames/frame-' + num + '.jpg';
        img.onload = function() {
            loadedCount++;
            // Draw first frame once loaded
            if (i === 0) {
                drawFrame(0);
            }
        };
        frames.push(img);
    }

    function drawFrame(index) {
        if (index === currentFrame && loadedCount > 1) return;
        if (!frames[index] || !frames[index].complete) return;

        currentFrame = index;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
    }

    // Scroll handler - map scroll position to frame index
    function onScroll() {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how far through the element we've scrolled
        // Start when element enters viewport, end when it leaves
        const elementTop = rect.top;
        const elementHeight = rect.height;

        // Progress: 0 when element top hits viewport bottom, 1 when element bottom hits viewport top
        const start = elementTop - windowHeight;
        const end = elementTop + elementHeight;
        const total = end - start;

        let progress = -start / total;
        progress = Math.max(0, Math.min(1, progress));

        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        drawFrame(frameIndex);
    }

    // Use requestAnimationFrame for smooth updates
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial draw
    onScroll();
})();
