// ============================================
// UI: Music Player, Scroll Indicator, Controls Visibility,
// Hero Animations, Nav Active State, Particles
// ============================================

(function () {
  const audio = document.getElementById('lofi-audio');
  const btn = document.getElementById('music-toggle');
  const scene = document.querySelector('.lofi-scene');
  const controls = document.getElementById('controls');
  const gameSection = document.getElementById('game-section');

  // --- Hero particles ---
  const particleContainer = document.getElementById('hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.width = (1 + Math.random() * 2) + 'px';
      p.style.height = p.style.width;
      if (Math.random() > 0.7) {
        p.style.background = 'rgba(255, 215, 0, 0.4)';
      }
      particleContainer.appendChild(p);
    }
  }

  // --- Pixel Tree Falling Leaves ---
  const treeContainer = document.querySelector('.skill-tree');
  if (treeContainer) {
    // Vibrant Palette: ForestGreen, LimeGreen, Gold (autumn accent)
    const leafColors = ['#228B22', '#32CD32', '#FFD700'];
    for (let i = 0; i < 20; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf-fall';
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDuration = (4 + Math.random() * 5) + 's';
      leaf.style.animationDelay = (Math.random() * 5) + 's';
      leaf.style.setProperty('--lc', leafColors[Math.floor(Math.random() * leafColors.length)]);
      // Random lateral drift between -30px and 30px
      leaf.style.setProperty('--ld', (Math.random() * 60 - 30) + 'px');
      treeContainer.appendChild(leaf);
    }
  }

  // --- Animated number counter ---
  const statNums = document.querySelectorAll('.hero-stat-num[data-count]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      el.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Use IntersectionObserver to trigger counter when visible
  if (statNums.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => observer.observe(el));
  }

  // --- Nav active state on scroll ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length && sections.length) {
    const updateNav = () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
          current = section.id;
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // --- Hide controls when scrolled past game section ---
  if (gameSection) {
    let visible = true;
    window.addEventListener('scroll', () => {
      const rect = gameSection.getBoundingClientRect();
      const shouldShow = rect.bottom > 100;
      if (shouldShow !== visible) {
        visible = shouldShow;
        if (controls) controls.style.display = shouldShow ? '' : 'none';
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

  // --- Hide scroll indicator after scrolling ---
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transition = 'opacity 0.5s';
      } else {
        scrollIndicator.style.opacity = '';
        scrollIndicator.style.transition = '';
      }
    }, { passive: true });
  }

  // --- Lofi music ---
  if (!audio || !btn) return;
  audio.volume = 0.3;

  let noteInterval = null;
  function setPlaying(on) {
    btn.classList.toggle('playing', on);
    if (scene) scene.classList.toggle('music-playing', on);
    if (on && !noteInterval) {
      noteInterval = setInterval(spawnNote, 800);
    } else if (!on && noteInterval) {
      clearInterval(noteInterval);
      noteInterval = null;
    }
  }

  const noteChars = ['\u266B','\u266A','\u2669','\u266C'];
  function spawnNote() {
    const note = document.createElement('span');
    note.className = 'spawn-note';
    note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
    const dx = (Math.random() - 0.5) * 60;
    const dy = -40 - Math.random() * 40;
    const rot = (Math.random() - 0.5) * 60;
    const size = 10 + Math.random() * 10;
    const dur = 1.5 + Math.random() * 1;
    note.style.cssText = `--ndx:${dx}px;--ndy:${dy}px;--nr:${rot}deg;font-size:${size}px;left:50%;top:-5px;animation-duration:${dur}s;`;
    btn.appendChild(note);
    setTimeout(() => note.remove(), dur * 1000);
  }

  function play() {
    audio.play().then(() => setPlaying(true)).catch(() => { });
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
