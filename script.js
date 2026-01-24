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
document.querySelectorAll('.section-header, .about-content, .pub-card, .project-card, .timeline-item, .contact-content').forEach(el => {
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
