/* ============================================================
   FSC redesign — interactions
   scroll reveals · nav state · 3D card tilt · counters · clock
   ============================================================ */
(function () {
  /* ---- nav scrolled state + mobile toggle ---- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('.dd-menu a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---- dropdown menus: click-to-toggle on touch/mobile ---- */
  document.querySelectorAll('.nav-dd > a').forEach(a => {
    a.addEventListener('click', (e) => {
      const isMobile = window.matchMedia('(max-width: 1080px)').matches;
      if (isMobile) {
        e.preventDefault();
        const dd = a.parentElement;
        const wasOpen = dd.classList.contains('open');
        document.querySelectorAll('.nav-dd.open').forEach(d => d.classList.remove('open'));
        if (!wasOpen) dd.classList.add('open');
      }
    });
  });

  /* ---- scroll reveal ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
    io.observe(el);
  });

  /* ---- 3D tilt on mission cards ---- */
  const tiltMax = 8;
  function bindTilt(card) {
    let rect = null;
    const enter = () => { rect = card.getBoundingClientRect(); };
    const move = (e) => {
      if (document.documentElement.getAttribute('data-motion') === 'off') return;
      if (!rect) rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
      const ry = (px - 0.5) * tiltMax * 2;
      const rx = -(py - 0.5) * tiltMax * 2;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };
    const leave = () => { card.style.transform = ''; rect = null; };
    card.addEventListener('mouseenter', enter);
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
  }
  document.querySelectorAll('.mcard').forEach(bindTilt);

  /* ---- animated counters ---- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const off = document.documentElement.getAttribute('data-motion') === 'off';
    if (off) { el.firstChild.textContent = target; return; }
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.firstChild.textContent = val;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---- HUD live clock (UTC, mission style) ---- */
  const clockEl = document.getElementById('hud-clock');
  if (clockEl) {
    const tick = () => {
      const d = new Date();
      const p = n => String(n).padStart(2, '0');
      clockEl.textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`;
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---- hero coordinate ticker (decorative) ---- */
  const coordEl = document.getElementById('hud-coord');
  if (coordEl) {
    const rnd = () => (Math.random() * 180 - 90).toFixed(3);
    setInterval(() => {
      if (document.documentElement.getAttribute('data-motion') === 'off') return;
      coordEl.textContent = `LAT ${rnd()}  LON ${(Math.random()*360-180).toFixed(3)}`;
    }, 1400);
  }
})();

/* ============================================================
   Site-wide effect chrome — ported from fsc-website public/js
   scroll progress bar · trailing cursor glow · touch tooltips
   ============================================================ */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionOff = () => reduced || document.documentElement.getAttribute('data-motion') === 'off';

  /* ---- scroll progress bar (animations.js → ScrollProgress) ---- */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  const setBar = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (height > 0 ? (winScroll / height) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', setBar, { passive: true });
  window.addEventListener('resize', setBar);
  setBar();

  /* ---- trailing cursor glow (hero-interactive.js), site-wide ---- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let mx = innerWidth / 2, my = innerHeight * 0.4, gx = mx, gy = my, raf = null;
    const frame = () => {
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      glow.style.background = 'radial-gradient(600px circle at ' + gx.toFixed(1) + 'px ' + gy.toFixed(1) +
        'px, color-mix(in srgb, var(--accent) 9%, transparent), transparent 60%)';
      raf = requestAnimationFrame(frame);
    };
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (motionOff()) { glow.style.opacity = '0'; return; }
      glow.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---- tap-to-toggle acronym tooltips on touch (tooltips.js) ---- */
  if (window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.tooltip-trigger').forEach(tr => {
      tr.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = tr.classList.contains('tt-open');
        document.querySelectorAll('.tooltip-trigger.tt-open').forEach(o => o.classList.remove('tt-open'));
        if (!open) tr.classList.add('tt-open');
      });
    });
    document.addEventListener('click', () =>
      document.querySelectorAll('.tooltip-trigger.tt-open').forEach(o => o.classList.remove('tt-open')));
  }
})();
