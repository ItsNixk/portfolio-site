document.addEventListener('DOMContentLoaded', function () {
  // ========== DISCORD STATUS (LANYARD API) ==========
  async function updateDiscordStatus() {
    const userId = '659864108895698970';
    const statusBadge = document.getElementById('discord-status');
    const statusIndicator = statusBadge.querySelector('.status-indicator');
    const statusLabel = statusBadge.querySelector('.status-label');

    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      const data = await response.json();

      if (data.success) {
        const { discord_status, activities } = data.data;

        // Update status indicator
        statusIndicator.className = `status-indicator ${discord_status}`;

        // Update status text
        const statusTexts = {
          online: 'Online',
          idle: 'Idle',
          dnd: 'Do Not Disturb',
          offline: 'Offline'
        };

        statusLabel.textContent = statusTexts[discord_status] || 'Offline';

        // Check for custom status
        const customStatus = activities.find(activity => activity.type === 4);

        if (customStatus && customStatus.state) {
          // Add custom status below the main status
          let activitySpan = statusBadge.querySelector('.status-activity');
          if (!activitySpan) {
            activitySpan = document.createElement('span');
            activitySpan.className = 'status-activity';
            statusBadge.querySelector('.status-text').appendChild(activitySpan);
          }

          // Include emoji if present
          let statusText = '';
          if (customStatus.emoji) {
            statusText = customStatus.emoji.name + ' ';
          }
          statusText += customStatus.state;
          activitySpan.textContent = statusText;
        } else {
          // Remove activity span if no custom status
          const activitySpan = statusBadge.querySelector('.status-activity');
          if (activitySpan) {
            activitySpan.remove();
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch Discord status:', error);
      statusLabel.textContent = 'Offline';
      statusIndicator.className = 'status-indicator offline';
    }
  }

  // Update status immediately and every 30 seconds
  updateDiscordStatus();
  setInterval(updateDiscordStatus, 30000);

  // ========== MATRIX RAIN EFFECT ==========
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Matrix configuration
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);
  const speeds = Array(columns).fill(0).map(() => 0.25 + Math.random() * 0.25);

  // Matrix animation
  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      // Gradient color for depth
      const y = drops[i] * fontSize;
      const gradient = ctx.createLinearGradient(0, y - fontSize, 0, y);
      gradient.addColorStop(0, 'rgba(0, 217, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 217, 255, 1)');
      ctx.fillStyle = gradient;

      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, y);

      // Reset drop randomly
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i] += speeds[i];
    }
  }

  setInterval(drawMatrix, 50);

  // ========== TYPING ANIMATION ==========
  const typedTextElement = document.querySelector('.typed-text');
  const phrases = [
    'scalable web applications',
    'powerful backend systems',
    'beautiful user interfaces',
    'gaming server infrastructure',
    'enterprise hosting solutions',
    'custom Discord bots',
    'FiveM communities'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before next phrase
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // ========== SMOOTH SCROLLING ==========
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Only prevent default for internal links
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          document.querySelector('.nav-links').classList.remove('active');
        }
      }
    });
  });

  // ========== ACTIVE NAV HIGHLIGHTING ==========
  function highlightNavOnScroll() {
    const sections = document.querySelectorAll('.section, .hero-section');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Observe individual animated elements
  document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach(el => {
    observer.observe(el);
  });

  // ========== NAVBAR SCROLL BEHAVIOR ==========
  let lastScroll = 0;
  const navbar = document.querySelector('.floating-nav');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.boxShadow = 'none';
    } else {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }

    lastScroll = currentScroll;
  });

  // ========== MOBILE MENU TOGGLE ==========
  // Create mobile menu toggle button
  const mobileMenuHTML = `
    <div class="menu-toggle">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  // Insert menu toggle before nav-social
  const navSocial = document.querySelector('.nav-social');
  navSocial.insertAdjacentHTML('beforebegin', mobileMenuHTML);

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.floating-nav')) {
      navLinksContainer.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });

  // ========== SKILL ICONS HOVER EFFECT ==========
  const skillItems = document.querySelectorAll('.skill-item');

  skillItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) rotate(5deg)';
    });

    item.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) rotate(0deg)';
    });
  });

  // ========== FORM SUBMISSION FEEDBACK ==========
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const submitBtn = this.querySelector('.btn-submit');
      const originalHTML = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      // The form will actually submit to Formspree
      // This just provides visual feedback
      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // ========== PARALLAX EFFECT FOR HERO ==========
  const heroSection = document.querySelector('.hero-section');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (heroSection && scrolled < window.innerHeight) {
      heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });

  // ========== PROJECT CARD TILT EFFECT ==========
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ========== STATS COUNTER ANIMATION ==========
  const stats = document.querySelectorAll('.stat-number');

  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = target.textContent;
        const numericValue = parseInt(targetValue.replace(/\D/g, ''));

        if (!isNaN(numericValue)) {
          let current = 0;
          const increment = numericValue / 50;
          const suffix = targetValue.replace(/[0-9]/g, '');

          const counter = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              target.textContent = numericValue + suffix;
              clearInterval(counter);
            } else {
              target.textContent = Math.floor(current) + suffix;
            }
          }, 30);
        }

        observer.unobserve(target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5
  });

  stats.forEach(stat => statsObserver.observe(stat));

  // ========== GRADIENT CURSOR EFFECT ==========
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Create cursor glow element
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursorGlow);

  let cursorX = 0;
  let cursorY = 0;

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Show cursor glow on mousemove
  document.addEventListener('mousemove', () => {
    cursorGlow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  // ========== CONSOLE MESSAGE ==========
  console.log(
    '%c👋 Hey there, fellow developer!',
    'color: #00d9ff; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);'
  );
  console.log(
    '%c🚀 Thanks for checking out my portfolio!',
    'color: #7b2ff7; font-size: 16px; font-weight: bold;'
  );
  console.log(
    '%c📧 Want to collaborate? Reach out at the contact section!',
    'color: #00d9ff; font-size: 14px;'
  );

  // ========== LOADING ANIMATION ==========
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Initial highlight
  highlightNavOnScroll();
});