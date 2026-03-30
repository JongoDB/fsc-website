// Interactive Hero Effects
// Cursor-reactive glow + proximity-based node network

(function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // --- Cursor Glow ---
    const glow = hero.querySelector('.hero-cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    if (glow) {
        hero.addEventListener('mousemove', function(e) {
            const rect = hero.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        hero.addEventListener('mouseleave', function() {
            glow.style.opacity = '0';
        });

        hero.addEventListener('mouseenter', function() {
            glow.style.opacity = '1';
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.background = 'radial-gradient(600px circle at ' + glowX + 'px ' + glowY + 'px, rgba(0, 168, 255, 0.07), transparent 60%)';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // --- Interactive Node Network ---
    const canvas = document.getElementById('hero-network');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    const NODE_COUNT = 50;
    const CONNECTION_DIST = 140;
    const CURSOR_RADIUS = 180;
    let cursorX = -1000, cursorY = -1000;
    let width, height;

    function resize() {
        const rect = hero.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
    }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                baseRadius: Math.random() * 1.5 + 0.8,
                radius: 0
            });
        }
    }

    hero.addEventListener('mousemove', function(e) {
        const rect = hero.getBoundingClientRect();
        cursorX = e.clientX - rect.left;
        cursorY = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', function() {
        cursorX = -1000;
        cursorY = -1000;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // Move
            node.x += node.vx;
            node.y += node.vy;

            // Bounce
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            // Cursor proximity - nodes glow and slightly repel
            const dx = node.x - cursorX;
            const dy = node.y - cursorY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const cursorInfluence = Math.max(0, 1 - dist / CURSOR_RADIUS);

            // Subtle push away from cursor
            if (dist < CURSOR_RADIUS && dist > 0) {
                node.x += (dx / dist) * cursorInfluence * 0.5;
                node.y += (dy / dist) * cursorInfluence * 0.5;
            }

            // Radius grows near cursor
            node.radius = node.baseRadius + cursorInfluence * 2;

            // Draw node
            const alpha = 0.2 + cursorInfluence * 0.6;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 168, 255, ' + alpha + ')';
            ctx.fill();

            // Draw glow ring on cursor-proximate nodes
            if (cursorInfluence > 0.3) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 212, 255, ' + (cursorInfluence * 0.3) + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    // Lines are brighter near cursor
                    const midX = (nodes[i].x + nodes[j].x) / 2;
                    const midY = (nodes[i].y + nodes[j].y) / 2;
                    const cdx = midX - cursorX;
                    const cdy = midY - cursorY;
                    const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
                    const cursorBoost = Math.max(0, 1 - cDist / CURSOR_RADIUS);

                    const lineAlpha = (1 - dist / CONNECTION_DIST) * (0.06 + cursorBoost * 0.2);

                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = 'rgba(0, 212, 255, ' + lineAlpha + ')';
                    ctx.lineWidth = 0.5 + cursorBoost * 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();

    window.addEventListener('resize', function() {
        resize();
        initNodes();
    });
})();
