// ================================
// NAFIZ AHMED - PORTFOLIO SCRIPTS
// ================================

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(15, 15, 35, 0.95)';
    navbar.style.padding = '12px 40px';
  } else {
    navbar.style.background = 'rgba(15, 15, 35, 0.8)';
    navbar.style.padding = '20px 40px';
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Typewriter Effect
const typewriterText = document.querySelector('.typewriter');
const roles = [
  'Machine Learning Engineer',
  'Computer Vision Researcher',
  'Agentic AI Developer',
  'Medical AI Enthusiast'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typewriterText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typewriterText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500; // Pause before typing next
  }

  setTimeout(typeWriter, typeSpeed);
}

// Start typewriter after page loads
setTimeout(typeWriter, 1000);

// Scroll Animation Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');

      // Stagger animation for cards
      if (entry.target.classList.contains('pub-card') ||
          entry.target.classList.contains('project-card') ||
          entry.target.classList.contains('timeline-item')) {
        const siblings = entry.target.parentElement.children;
        Array.from(siblings).forEach((sibling, index) => {
          setTimeout(() => {
            sibling.classList.add('animate');
          }, index * 100);
        });
      }
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.section-header, .about-content, .pub-card, .project-card, .timeline-item, .contact-content, .cv-preview-card, .cv-skill-block').forEach(el => {
  observer.observe(el);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add('active');
    } else {
      navLink?.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightNavOnScroll);

// Parallax effect for floating icons
const floatIcons = document.querySelectorAll('.float-icon');

window.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX / window.innerWidth - 0.5;
  const mouseY = e.clientY / window.innerHeight - 0.5;

  floatIcons.forEach((icon, index) => {
    const speed = (index + 1) * 10;
    icon.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
  });
});

// Stats counter animation
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;

  const heroSection = document.querySelector('.hero');
  const heroRect = heroSection.getBoundingClientRect();

  if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
    stats.forEach(stat => {
      const finalValue = stat.textContent;
      const isPercentage = finalValue.includes('%');
      const isPlus = finalValue.includes('+');
      const numericValue = parseFloat(finalValue);

      if (isNaN(numericValue)) return;

      let current = 0;
      const increment = numericValue / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          current = numericValue;
          clearInterval(timer);
        }

        let display = current.toFixed(current % 1 === 0 ? 0 : 1);
        if (isPlus) display += '+';
        if (isPercentage) display += '%';
        stat.textContent = display;
      }, 30);
    });

    statsAnimated = true;
  }
}

window.addEventListener('scroll', animateStats);
animateStats(); // Check on load

// Cursor glow effect (optional - subtle)
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// Console easter egg
console.log('%c👋 Hello, curious developer!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cWant to collaborate? Reach out at nafizahmed273273@gmail.com', 'font-size: 14px; color: #94a3b8;');

// ================================
// THREE.JS NEURAL NETWORK BACKGROUND
// ================================
function initNeuralNetwork() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const COUNT = 90;
  const posArr = new Float32Array(COUNT * 3);
  const colArr = new Float32Array(COUNT * 3);
  const vels = [];
  const cyan = new THREE.Color(0x00f0ff);
  const red = new THREE.Color(0xff073a);

  for (let i = 0; i < COUNT; i++) {
    posArr[i * 3] = (Math.random() - 0.5) * 18;
    posArr[i * 3 + 1] = (Math.random() - 0.5) * 12;
    posArr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    const c = Math.random() > 0.8 ? red : cyan;
    colArr[i * 3] = c.r;
    colArr[i * 3 + 1] = c.g;
    colArr[i * 3 + 2] = c.b;
    vels.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.003
    });
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  })));

  const MAX_L = 500;
  const lPos = new Float32Array(MAX_L * 6);
  const lCol = new Float32Array(MAX_L * 6);
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
  lGeo.setDrawRange(0, 0);
  scene.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.25
  })));

  camera.position.z = 9;
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  (function animate() {
    requestAnimationFrame(animate);
    const p = pGeo.attributes.position.array;

    for (let i = 0; i < COUNT; i++) {
      p[i * 3] += vels[i].x;
      p[i * 3 + 1] += vels[i].y;
      p[i * 3 + 2] += vels[i].z;
      if (Math.abs(p[i * 3]) > 9) vels[i].x *= -1;
      if (Math.abs(p[i * 3 + 1]) > 6) vels[i].y *= -1;
      if (Math.abs(p[i * 3 + 2]) > 4) vels[i].z *= -1;
      const dx = mx * 7 - p[i * 3];
      const dy = my * 5 - p[i * 3 + 1];
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 4) {
        p[i * 3] += dx * 0.0015;
        p[i * 3 + 1] += dy * 0.0015;
      }
    }
    pGeo.attributes.position.needsUpdate = true;

    let li = 0;
    for (let i = 0; i < COUNT && li < MAX_L; i++) {
      for (let j = i + 1; j < COUNT && li < MAX_L; j++) {
        const dx = p[i * 3] - p[j * 3];
        const dy = p[i * 3 + 1] - p[j * 3 + 1];
        const dz = p[i * 3 + 2] - p[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.8) {
          const a = 1 - dist / 2.8;
          const idx = li * 6;
          lPos[idx] = p[i * 3]; lPos[idx + 1] = p[i * 3 + 1]; lPos[idx + 2] = p[i * 3 + 2];
          lPos[idx + 3] = p[j * 3]; lPos[idx + 4] = p[j * 3 + 1]; lPos[idx + 5] = p[j * 3 + 2];
          lCol[idx] = 0; lCol[idx + 1] = 0.94 * a; lCol[idx + 2] = a;
          lCol[idx + 3] = 0; lCol[idx + 4] = 0.94 * a; lCol[idx + 5] = a;
          li++;
        }
      }
    }

    lGeo.setDrawRange(0, li * 2);
    lGeo.attributes.position.needsUpdate = true;
    lGeo.attributes.color.needsUpdate = true;

    camera.position.x = Math.sin(Date.now() * 0.0001) * 0.5;
    camera.position.y = Math.cos(Date.now() * 0.00012) * 0.3;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

if (typeof THREE !== 'undefined') initNeuralNetwork();
else window.addEventListener('load', initNeuralNetwork);

// ================================
// NEURO PET - AI COMPANION GAME
// ================================
(function () {
  const pet = document.getElementById('neuro-pet');
  if (!pet) return;

  const bubble = document.getElementById('petBubble');
  const scoreEl = document.getElementById('neuronScore');
  const sectionsEl = document.getElementById('sectionsFound');
  const levelEl = document.getElementById('petLevel');
  const xpFill = document.getElementById('petXP');
  const sprite = pet.querySelector('.pet-sprite');
  const lvlTag = pet.querySelector('.pet-lvl');

  const S = {
    xp: 0, level: 1, neurons: 0,
    discovered: new Set(),
    mood: 'idle',
    lastScroll: Date.now(),
    lastY: window.scrollY,
    bTimeout: null, wTimeout: null
  };

  const INFO = {
    hero: "Hi! I'm Neuro! Scroll down to explore Nafiz's world!",
    about: "Magna Cum Laude & Top 2%! This human is brilliant!",
    publications: "Published research in Elsevier! Real scientist vibes!",
    projects: "92.7% Dice score with only 5% data?! Incredible!",
    experience: "From Sweden to New York - building AI everywhere!",
    cv: "Download the CV for the full story!",
    contact: "Want to connect? Nafiz would love to hear from you!"
  };

  function say(text, dur) {
    dur = dur || 3500;
    clearTimeout(S.bTimeout);
    bubble.textContent = text;
    bubble.classList.add('visible');
    S.bTimeout = setTimeout(() => bubble.classList.remove('visible'), dur);
  }

  function addXP(n) {
    S.xp += n;
    const need = S.level * 25;
    if (S.xp >= need) {
      S.xp -= need;
      S.level++;
      levelEl.textContent = S.level;
      lvlTag.textContent = 'Lv.' + S.level;
      say('Level up! Now Level ' + S.level + '!', 2500);
      sprite.classList.add('levelup');
      setTimeout(() => sprite.classList.remove('levelup'), 800);
    }
    xpFill.style.width = (S.xp / (S.level * 25) * 100) + '%';
  }

  function mood(m) { S.mood = m; sprite.className = 'pet-sprite ' + m; }

  // Spawn collectible neurons in each section
  const collectibles = [];
  document.querySelectorAll('section[id]').forEach(sec => {
    if (!sec.style.position || sec.style.position === 'static') {
      sec.style.position = 'relative';
    }
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.className = 'collectible-neuron';
      el.innerHTML = '<i class="fas fa-bolt"></i>';
      el.style.left = (15 + Math.random() * 70) + '%';
      el.style.top = (15 + Math.random() * 70) + '%';
      el.addEventListener('click', function () {
        if (this.dataset.collected) return;
        this.dataset.collected = '1';
        this.classList.add('collected');
        S.neurons++;
        scoreEl.textContent = S.neurons;
        addXP(15);
        mood('happy');
        setTimeout(() => mood('idle'), 1000);
        setTimeout(() => this.remove(), 500);
      });
      sec.appendChild(el);
      collectibles.push(el);
    }
  });

  function getCurSection() {
    let cur = null;
    document.querySelectorAll('section[id]').forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5) cur = s.id;
    });
    return cur;
  }

  function autoCollect() {
    const petR = pet.getBoundingClientRect();
    collectibles.forEach(n => {
      if (n.dataset.collected) return;
      const r = n.getBoundingClientRect();
      if (r.top > 0 && r.bottom < window.innerHeight) {
        if (Math.abs(r.top - petR.top) < 250 && Math.abs(r.left - petR.left) < 300) {
          n.dataset.collected = '1';
          n.classList.add('collected');
          S.neurons++;
          scoreEl.textContent = S.neurons;
          addXP(10);
          setTimeout(() => n.remove(), 500);
        }
      }
    });
  }

  window.addEventListener('scroll', () => {
    S.lastScroll = Date.now();
    S.lastY = window.scrollY;
    mood('walking');
    clearTimeout(S.wTimeout);
    S.wTimeout = setTimeout(() => mood('idle'), 600);

    const sec = getCurSection();
    if (sec && !S.discovered.has(sec) && INFO[sec]) {
      S.discovered.add(sec);
      sectionsEl.textContent = S.discovered.size;
      mood('scanning');
      setTimeout(() => {
        say(INFO[sec], 4000);
        addXP(20);
        mood('happy');
        setTimeout(() => mood('idle'), 2000);
      }, 400);
    }
    autoCollect();
  });

  pet.addEventListener('click', () => {
    const msgs = [
      "Beep boop! I'm your AI companion!",
      "Nafiz achieved 92.7% Dice score! Amazing!",
      "I've collected " + S.neurons + " neurons so far!",
      "Keep scrolling to discover more sections!",
      "Nafiz builds Agentic AI at Periscopelabs!",
      "Click the glowing orbs to collect neurons!",
      "I'm Level " + S.level + "! Help me grow!",
      "Fun fact: Nafiz graduated Top 2% from AIUB!"
    ];
    say(msgs[Math.floor(Math.random() * msgs.length)], 3000);
    mood('happy');
    setTimeout(() => mood('idle'), 1200);
    addXP(5);
  });

  // Sleep if idle too long
  setInterval(() => {
    if (Date.now() - S.lastScroll > 12000 && S.mood !== 'sleeping') {
      mood('sleeping');
      say('Zzz... scroll to wake me!', 2500);
    }
  }, 4000);

  // Initial greeting
  setTimeout(() => say("Hi! I'm Neuro! Click me or scroll to explore!", 4500), 1500);
})();
