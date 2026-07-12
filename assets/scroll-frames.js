/* Scroll-scrubbed frame animation — ported from fsc-website/public/js/scroll-animation.js
   Plays public/images/scroll-frames/frame-000..059.jpg as you scroll through
   the 200vh #scroll-animation section. Respects the site motion tweak. */
(function () {
  const container = document.getElementById('scroll-animation');
  if (!container) return;

  const canvas = document.getElementById('scroll-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const FRAME_COUNT = 60;
  const FREEZE_FRAME = 32; // shown when motion is off / reduced
  const frames = [];
  let loadedCount = 0;
  let currentFrame = -1;

  canvas.width = 1880;
  canvas.height = 1004;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionOff = () => reduced || document.documentElement.getAttribute('data-motion') === 'off';

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    const num = String(i).padStart(3, '0');
    img.src = 'public/images/scroll-frames/frame-' + num + '.jpg';
    img.onload = function () {
      loadedCount++;
      if (i === 0 && currentFrame < 0) drawFrame(motionOff() ? Math.min(FREEZE_FRAME, i) : 0);
      if (i === FREEZE_FRAME && motionOff()) drawFrame(FREEZE_FRAME);
    };
    frames.push(img);
  }

  function drawFrame(index) {
    if (index === currentFrame) return;
    if (!frames[index] || !frames[index].complete || !frames[index].naturalWidth) return;
    currentFrame = index;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
  }

  function onScroll() {
    if (motionOff()) { drawFrame(FREEZE_FRAME); return; }
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Progress: 0 when section top hits viewport bottom, 1 when its bottom hits viewport top
    const start = rect.top - windowHeight;
    const end = rect.top + rect.height;
    const total = end - start;

    let progress = -start / total;
    progress = Math.max(0, Math.min(1, progress));

    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
    drawFrame(frameIndex);
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);

  onScroll();
})();
