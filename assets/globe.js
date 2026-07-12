/* ============================================================
   FSC hero — canvas motion centerpiece
   Three switchable modes: 'globe' (network arcs),
   'grid' (rotating threat terrain), 'radar' (orbital sweep).
   No external libs — 2D canvas with a tiny 3D projector.
   Exposes window.FSCHero.
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, DPR = 1, CX = 0, CY = 0;
  let mode = 'grid';        // production default (tweakable)
  let motion = 'subtle';    // full | subtle | off — production default
  let raf = null, t = 0;
  let accent = '#0066cc', accent2 = '#00a8ff';

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    accent = (cs.getPropertyValue('--accent') || '#00a8ff').trim() || '#00a8ff';
    accent2 = (cs.getPropertyValue('--accent-2') || '#00d4ff').trim() || '#00d4ff';
  }

  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    if (isNaN(n)) return [0, 168, 255];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgba = (h, a) => { const c = hexToRgb(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    CX = W / 2; CY = H / 2;
    buildScene();
  }

  /* ---------- projection ---------- */
  const FL = 620; // focal length
  function project(x, y, z) {
    const s = FL / (FL + z);
    return { x: CX + x * s, y: CY + y * s, s, z };
  }
  function rotY(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }; }
  function rotX(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }; }

  /* ---------- scene data ---------- */
  let R = 240;
  let nodes = [], arcs = [], gridPts = [], stars = [], netNodes = [];
  let curX = -1000, curY = -1000; // cursor (network mode)

  function sph(lat, lon, rad) {
    return {
      x: rad * Math.cos(lat) * Math.cos(lon),
      y: rad * Math.sin(lat),
      z: rad * Math.cos(lat) * Math.sin(lon),
    };
  }

  function buildScene() {
    R = Math.max(150, Math.min(W, H) * 0.34);

    // threat nodes on the sphere
    nodes = [];
    const N = 34;
    for (let i = 0; i < N; i++) {
      const lat = Math.asin(2 * ((i + 0.5) / N) - 1);
      const lon = i * 2.399963; // golden angle
      nodes.push({ lat, lon, pulse: Math.random() * Math.PI * 2, hot: Math.random() > 0.72 });
    }
    // arcs between random node pairs
    arcs = [];
    for (let i = 0; i < 14; i++) {
      const a = nodes[(Math.random() * N) | 0], b = nodes[(Math.random() * N) | 0];
      if (a === b) continue;
      arcs.push({ a, b, off: Math.random(), speed: 0.15 + Math.random() * 0.5 });
    }

    // grid terrain points
    gridPts = [];
    const G = 22, span = R * 2.4, step = span / (G - 1);
    for (let ix = 0; ix < G; ix++) for (let iz = 0; iz < G; iz++) {
      gridPts.push({ gx: -span / 2 + ix * step, gz: -span / 2 + iz * step, ix, iz, G });
    }

    // background stars
    stars = [];
    for (let i = 0; i < 90; i++) stars.push({ x: (Math.random() - 0.5) * W * 1.2, y: (Math.random() - 0.5) * H * 1.2, r: Math.random() * 1.3 + 0.2, tw: Math.random() * Math.PI * 2 });

    // free-floating cursor-reactive network (ported from hero-interactive.js)
    netNodes = [];
    for (let i = 0; i < 50; i++) {
      netNodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseRadius: Math.random() * 1.5 + 0.8,
      });
    }
  }

  /* ---------- drawing ---------- */
  function drawStars() {
    for (const s of stars) {
      const a = 0.15 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.5 + s.tw));
      ctx.fillStyle = `rgba(200,220,255,${a})`;
      ctx.beginPath(); ctx.arc(CX + s.x, CY + s.y, s.r, 0, 7); ctx.fill();
    }
  }

  function spinAngle() {
    const speed = motion === 'off' ? 0 : motion === 'subtle' ? 0.06 : 0.13;
    return t * speed;
  }

  function drawGlobe() {
    const ay = spinAngle();
    const ax = -0.42;
    const tilt = p => rotX(rotY(p, ay), ax);

    // wireframe meridians + parallels
    ctx.lineWidth = 1;
    for (let m = 0; m < 12; m++) {
      const lon = (m / 12) * Math.PI * 2;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 48; i++) {
        const lat = -Math.PI / 2 + (i / 48) * Math.PI;
        const p = tilt(sph(lat, lon, R));
        const pr = project(p.x, p.y, p.z);
        const front = p.z < 0;
        ctx.strokeStyle = rgba(accent, front ? 0.16 : 0.05);
        if (i % 8 === 0) { if (started) ctx.stroke(); ctx.beginPath(); ctx.moveTo(pr.x, pr.y); started = true; }
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.stroke();
    }
    for (let pl = 1; pl < 7; pl++) {
      const lat = -Math.PI / 2 + (pl / 7) * Math.PI;
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const lon = (i / 64) * Math.PI * 2;
        const p = tilt(sph(lat, lon, R));
        const pr = project(p.x, p.y, p.z);
        if (i === 0) ctx.moveTo(pr.x, pr.y); else ctx.lineTo(pr.x, pr.y);
      }
      ctx.strokeStyle = rgba(accent, 0.08);
      ctx.stroke();
    }

    // arcs (great-circle-ish lifted paths) with travelling pulse
    for (const arc of arcs) {
      const steps = 40;
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const f = i / steps;
        const lat = arc.a.lat + (arc.b.lat - arc.a.lat) * f;
        const lon = arc.a.lon + (arc.b.lon - arc.a.lon) * f;
        const lift = 1 + 0.28 * Math.sin(f * Math.PI);
        const p = tilt(sph(lat, lon, R * lift));
        pts.push(project(p.x, p.y, p.z, ));
      }
      ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      ctx.strokeStyle = rgba(accent2, 0.18); ctx.lineWidth = 1; ctx.stroke();

      if (motion !== 'off') {
        const head = (arc.off + t * arc.speed) % 1;
        const hi = Math.min(steps, Math.floor(head * steps));
        const hp = pts[hi];
        if (hp) {
          const g = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 8);
          g.addColorStop(0, rgba(accent2, 0.9)); g.addColorStop(1, rgba(accent2, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hp.x, hp.y, 8, 0, 7); ctx.fill();
        }
      }
    }

    // nodes
    for (const nd of nodes) {
      const p = tilt(sph(nd.lat, nd.lon, R));
      const pr = project(p.x, p.y, p.z);
      const front = p.z < 0;
      const a = front ? 0.9 : 0.25;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2 + nd.pulse);
      const col = nd.hot ? accent2 : accent;
      if (nd.hot && front) {
        const g = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, 10 + pulse * 6);
        g.addColorStop(0, rgba(col, 0.55)); g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pr.x, pr.y, 10 + pulse * 6, 0, 7); ctx.fill();
      }
      ctx.fillStyle = rgba(col, a);
      ctx.beginPath(); ctx.arc(pr.x, pr.y, front ? 2.1 : 1.3, 0, 7); ctx.fill();
    }

    // faint core glow
    const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.1);
    cg.addColorStop(0, rgba(accent, 0.06)); cg.addColorStop(1, rgba(accent, 0));
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(CX, CY, R * 1.1, 0, 7); ctx.fill();
  }

  function drawGrid() {
    const ay = spinAngle() * 0.5;
    const ax = -0.95;
    const tilt = p => rotY(rotX(p, ax), ay);
    const amp = motion === 'off' ? 0 : 1;

    // vertices with wave height
    const proj = gridPts.map(g => {
      const d = Math.hypot(g.gx, g.gz);
      const h = Math.sin(d * 0.02 - t * 1.6) * 26 * amp + Math.sin(g.gx * 0.03 + t) * 10 * amp;
      const p = tilt({ x: g.gx, y: -h - 40, z: g.gz });
      return { ...project(p.x, p.y, p.z), h, ix: g.ix, iz: g.iz, G: g.G };
    });
    const at = (ix, iz) => proj[ix * gridPts[0].G + iz];
    const G = gridPts[0].G;

    ctx.lineWidth = 1;
    for (let ix = 0; ix < G; ix++) for (let iz = 0; iz < G; iz++) {
      const p = at(ix, iz);
      if (ix < G - 1) { const q = at(ix + 1, iz); line(p, q); }
      if (iz < G - 1) { const q = at(ix, iz + 1); line(p, q); }
    }
    function line(p, q) {
      const hot = Math.max(p.h, q.h);
      const a = 0.05 + Math.min(0.5, Math.max(0, hot / 40) * 0.5);
      ctx.strokeStyle = rgba(hot > 14 ? accent2 : accent, a);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    }
    // peak nodes
    for (const p of proj) {
      if (p.h > 20) { ctx.fillStyle = rgba(accent2, 0.8); ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fill(); }
    }
  }

  function drawRadar() {
    const rings = 5;
    ctx.lineWidth = 1;
    for (let i = 1; i <= rings; i++) {
      const rr = R * 1.25 * (i / rings);
      ctx.strokeStyle = rgba(accent, 0.1);
      ctx.beginPath(); ctx.ellipse(CX, CY, rr, rr * 0.34, 0, 0, 7); ctx.stroke();
    }
    // cross axes
    ctx.strokeStyle = rgba(accent, 0.08);
    ctx.beginPath(); ctx.moveTo(CX - R * 1.3, CY); ctx.lineTo(CX + R * 1.3, CY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX, CY - R * 0.45); ctx.lineTo(CX, CY + R * 0.45); ctx.stroke();

    const sweep = motion === 'off' ? 0.6 : t * 0.7;
    // sweep wedge
    const seg = 40;
    ctx.beginPath(); ctx.moveTo(CX, CY);
    for (let i = 0; i <= seg; i++) {
      const a = sweep - (i / seg) * 0.5;
      ctx.lineTo(CX + Math.cos(a) * R * 1.25, CY + Math.sin(a) * R * 1.25 * 0.34);
    }
    ctx.closePath();
    const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.25);
    g.addColorStop(0, rgba(accent2, 0.16)); g.addColorStop(1, rgba(accent2, 0));
    ctx.fillStyle = g; ctx.fill();

    // blips orbiting
    for (let i = 0; i < 16; i++) {
      const seed = i * 1.7;
      const orbit = R * 1.25 * (0.3 + ((i * 37) % 70) / 100);
      const ang = seed + (motion === 'off' ? 0 : t * (0.1 + (i % 5) * 0.05));
      const x = CX + Math.cos(ang) * orbit;
      const y = CY + Math.sin(ang) * orbit * 0.34;
      const near = ((ang - sweep) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) < 0.7;
      const a = near ? 0.95 : 0.28;
      const col = (i % 3 === 0) ? accent2 : accent;
      if (near) {
        const gg = ctx.createRadialGradient(x, y, 0, x, y, 9);
        gg.addColorStop(0, rgba(col, 0.6)); gg.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
      }
      ctx.fillStyle = rgba(col, a);
      ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
    }
  }

  /* cursor-reactive node network — faithful port of the original
     hero-interactive.js (drift, proximity glow, repel, boosted links) */
  function drawNetwork() {
    const CONNECTION_DIST = 140, CURSOR_RADIUS = 180;
    const drift = motion === 'off' ? 0 : motion === 'subtle' ? 0.5 : 1;

    for (let i = 0; i < netNodes.length; i++) {
      const node = netNodes[i];
      node.x += node.vx * drift;
      node.y += node.vy * drift;
      if (node.x < 0 || node.x > W) node.vx *= -1;
      if (node.y < 0 || node.y > H) node.vy *= -1;

      const dx = node.x - curX;
      const dy = node.y - curY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const infl = Math.max(0, 1 - dist / CURSOR_RADIUS);

      if (dist < CURSOR_RADIUS && dist > 0 && drift > 0) {
        node.x += (dx / dist) * infl * 0.5;
        node.y += (dy / dist) * infl * 0.5;
      }
      node.radius = node.baseRadius + infl * 2;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 7);
      ctx.fillStyle = rgba(accent, 0.2 + infl * 0.6);
      ctx.fill();

      if (infl > 0.3) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4, 0, 7);
        ctx.strokeStyle = rgba(accent2, infl * 0.3);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    for (let i = 0; i < netNodes.length; i++) {
      for (let j = i + 1; j < netNodes.length; j++) {
        const dx = netNodes[i].x - netNodes[j].x;
        const dy = netNodes[i].y - netNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const midX = (netNodes[i].x + netNodes[j].x) / 2;
          const midY = (netNodes[i].y + netNodes[j].y) / 2;
          const cDist = Math.hypot(midX - curX, midY - curY);
          const boost = Math.max(0, 1 - cDist / CURSOR_RADIUS);
          ctx.beginPath();
          ctx.moveTo(netNodes[i].x, netNodes[i].y);
          ctx.lineTo(netNodes[j].x, netNodes[j].y);
          ctx.strokeStyle = rgba(accent2, (1 - dist / CONNECTION_DIST) * (0.06 + boost * 0.2));
          ctx.lineWidth = 0.5 + boost * 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawStars();
    if (mode === 'grid') drawGrid();
    else if (mode === 'radar') drawRadar();
    else if (mode === 'network') drawNetwork();
    else drawGlobe();
    const dt = motion === 'off' ? 0 : (motion === 'subtle' ? 0.006 : 0.012);
    t += dt;
    raf = requestAnimationFrame(frame);
  }

  function start() { if (!raf) { readColors(); raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  const api = {
    setMode(m) { mode = m; },
    setMotion(m) { motion = m; if (m === 'off') { stop(); readColors(); frame(); stop(); ctx.clearRect(0,0,W,H); drawStars(); (mode==='grid'?drawGrid:mode==='radar'?drawRadar:mode==='network'?drawNetwork:drawGlobe)(); } else start(); },
    refreshColors() { readColors(); },
    start, stop,
  };
  window.FSCHero = api;

  window.addEventListener('resize', resize);
  resize();

  // cursor tracking for the network mode (canvas is pointer-transparent,
  // so listen on the hero section it fills)
  const heroEl = canvas.closest('.hero') || canvas.parentElement;
  if (heroEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      curX = e.clientX - r.left;
      curY = e.clientY - r.top;
    });
    heroEl.addEventListener('mouseleave', () => { curX = -1000; curY = -1000; });
  }

  // pause when off-screen for perf
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting && motion !== 'off') start(); else stop(); });
  }, { threshold: 0 });
  io.observe(canvas);
  start();
})();
