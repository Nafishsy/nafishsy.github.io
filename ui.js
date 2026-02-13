// ============================================
// UI: Music Player, Scroll Indicator, Controls Visibility
// ============================================

(function () {
  const audio = document.getElementById('lofi-audio');
  const btn = document.getElementById('music-toggle');
  const scene = document.querySelector('.lofi-scene');
  const scrollBtn = document.getElementById('scroll-to-cv');
  const controls = document.getElementById('controls');
  const gameSection = document.getElementById('game-section');

  // --- Scroll indicator ---
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Mobile scroll banner ---
  const mobileScroll = document.getElementById('mobile-scroll-cv');
  if (mobileScroll) {
    mobileScroll.addEventListener('click', () => {
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Hide controls, busy sidebar & mobile banner when scrolled past game section ---
  if (gameSection) {
    let visible = true;
    window.addEventListener('scroll', () => {
      const rect = gameSection.getBoundingClientRect();
      const shouldShow = rect.bottom > 100;
      if (shouldShow !== visible) {
        visible = shouldShow;
        if (controls) controls.style.display = shouldShow ? '' : 'none';
        if (scrollBtn) scrollBtn.style.display = shouldShow ? '' : 'none';
        if (mobileScroll) mobileScroll.style.display = shouldShow ? '' : 'none';
      }
    }, { passive: true });
  }

  // --- Demo tabs ---
  const demoUrls = {
    'few-shot': 'https://suzera1n-few-shot.hf.space',
    'passported': 'https://suzera1n-passported.hf.space',
    'scoboba': 'https://suzera1n-scoboba.hf.space'
  };
  const demoFrame = document.getElementById('demo-frame');
  const demoTabs = document.querySelectorAll('.demo-tab');
  if (demoFrame && demoTabs.length) {
    demoFrame.addEventListener('load', () => demoFrame.classList.add('loaded'));
    demoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        demoTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        demoFrame.classList.remove('loaded');
        demoFrame.src = demoUrls[tab.dataset.demo];
      });
    });
  }

  // --- Lofi music ---
  if (!audio || !btn) return;
  audio.volume = 0.3;

  function setPlaying(on) {
    btn.classList.toggle('playing', on);
    if (scene) scene.classList.toggle('music-playing', on);
  }

  function play() {
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }

  // Auto-start: try immediately, fall back to first user interaction
  audio.play().then(() => setPlaying(true)).catch(() => {
    const startOnce = () => {
      play();
      document.removeEventListener('click', startOnce);
      document.removeEventListener('keydown', startOnce);
    };
    document.addEventListener('click', startOnce);
    document.addEventListener('keydown', startOnce);
  });

  // Toggle button
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      play();
    } else {
      audio.pause();
      setPlaying(false);
    }
  });
})();
