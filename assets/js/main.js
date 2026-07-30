  document.getElementById('year').textContent = new Date().getFullYear();

  // header scroll state
  const header = document.getElementById('siteHeader');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive:true });

  // mobile menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  burger.addEventListener('click', () => mobileMenu.style.display = 'flex');
  closeMenu.addEventListener('click', () => mobileMenu.style.display = 'none');
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.style.display = 'none'));

  // scroll reveal (fade-up sections)
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // ritual connecting line draw-in
  const stepsBlock = document.getElementById('stepsBlock');
  const stepsIo = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { stepsBlock.classList.add('in-view'); stepsIo.unobserve(stepsBlock); } });
  }, { threshold: 0.3 });
  stepsIo.observe(stepsBlock);

  // ---- cinematic hero: fullscreen video, pinned for ~300vh, playback locked to scroll. ----
  // The video never autoplays — it stays paused and only ever advances because this script
  // moves it. Scroll position is sampled into a target progress value; the actual
  // video.currentTime is never set directly from a scroll event. Instead a dedicated
  // requestAnimationFrame loop eases currentTime toward that target every frame, so
  // playback glides smoothly (no jumps/stutter) and reverses cleanly when scrolling back up.
  const heroPin = document.querySelector('.hero-pin');
  const heroVideo = document.getElementById('heroVideo');
  const lightSweep = document.getElementById('lightSweep');
  const scrollCue = document.getElementById('scrollCue');

  function clamp01(v){ return Math.max(0, Math.min(1, v)); }
  function mapRange(p, a, b){ if (a === b) return p >= b ? 1 : 0; return clamp01((p - a) / (b - a)); }

  let videoReady = false;
  let videoDuration = 0;
  let targetProgress = 0; // written only by scroll/resize — never touches currentTime
  let smoothTime = 0;     // eased currentTime, advanced only inside the rAF loop below

  function markVideoReady(){
    if (videoReady) return;
    videoDuration = heroVideo.duration || 0;
    if (!(videoDuration > 0)) return;
    videoReady = true;
    heroVideo.pause();
    heroVideo.currentTime = 0;
  }
  heroVideo.pause();
  // iOS Safari won't render seeked frames until the video has been "played" at least once —
  // silently prime it (muted, imperceptible single frame), then immediately pause again.
  // This is not autoplay: playback never advances beyond this priming without scroll input.
  const primePlay = heroVideo.play();
  if (primePlay && primePlay.catch) primePlay.catch(() => {});
  // Data-URI video sources can finish loading metadata synchronously (during parse), i.e.
  // BEFORE this script attaches its listeners — so 'loadedmetadata' may already have fired
  // and would otherwise be missed. Check readyState directly too, and poll as a safety net.
  heroVideo.addEventListener('loadedmetadata', markVideoReady);
  heroVideo.addEventListener('canplay', markVideoReady);
  heroVideo.addEventListener('playing', () => { heroVideo.pause(); markVideoReady(); });
  if (heroVideo.readyState >= 1) markVideoReady();
  let readyPollTries = 0;
  const readyPoll = setInterval(() => {
    readyPollTries++;
    if (videoReady || readyPollTries > 40) { clearInterval(readyPoll); return; }
    if (heroVideo.readyState >= 1) markVideoReady();
  }, 50);

  // Scroll/resize update ONLY the target — cheap, no video/layout writes here.
  function setTargetFromScroll(){
    const rect = heroPin.getBoundingClientRect();
    const total = heroPin.offsetHeight - window.innerHeight;
    const p = clamp01(-rect.top / Math.max(total, 1));
    targetProgress = p;

    // lightweight UI reactions — fine to update directly, they're not the video
    lightSweep.style.opacity = String(0.1 + p * 0.16);
    scrollCue.style.opacity = String(1 - mapRange(p, 0, 0.08));
  }

  let ticking = false;
  function onHeroScroll(){
    if (!ticking) { ticking = true; requestAnimationFrame(() => { setTargetFromScroll(); ticking = false; }); }
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: heroPin, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: () => setTargetFromScroll()
    });
  } else {
    window.addEventListener('scroll', onHeroScroll, { passive:true });
    window.addEventListener('resize', onHeroScroll, { passive:true });
  }
  setTargetFromScroll();

  // The ONLY place currentTime is ever written. Eases smoothTime toward targetProgress's
  // time every animation frame (never assigns the target directly), so the video glides
  // continuously — buttery-smooth forward or backward — instead of jumping between seeks.
  const SMOOTHING = 0.14;
  function heroRAF(){
    if (videoReady && videoDuration > 0) {
      const targetTime = targetProgress * videoDuration;
      const delta = targetTime - smoothTime;
      smoothTime += Math.abs(delta) > 0.0015 ? delta * SMOOTHING : delta;
      if (Math.abs(heroVideo.currentTime - smoothTime) > 0.0009) {
        try { heroVideo.currentTime = smoothTime; } catch (e) { /* not seekable yet */ }
      }
    }
    requestAnimationFrame(heroRAF);
  }
  requestAnimationFrame(heroRAF);

  // contact form -> sends silently to info@soyolorea.com via Web3Forms (static page, no backend of its own)
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    formMsg.textContent = '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await res.json();

      if (res.ok && data.success) {
        formMsg.textContent = 'Gracias — tu mensaje fue enviado. Te responderemos muy pronto.';
        form.reset();
      } else {
        throw new Error(data.message || 'No se pudo enviar');
      }
    } catch (err) {
      formMsg.textContent = 'No pudimos enviar tu mensaje. Escríbenos directo a info@soyolorea.com.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
