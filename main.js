document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 800, once: true, offset: 80 });

  const loadingScreen = document.getElementById('loadingScreen');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const root = document.documentElement;
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.querySelector('.back-to-top');
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const contactForm = document.getElementById('contactForm');
  const year = document.getElementById('year');
  const typedText = document.getElementById('typedText');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarNav');

  if (year) year.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }
  updateThemeUI();

  setTimeout(() => loadingScreen?.classList.add('hidden'), 900);

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', current);
    localStorage.setItem('portfolio-theme', current);
    updateThemeUI();
  });

  function updateThemeUI() {
    const icon = themeToggle?.querySelector('i');
    if (!icon) return;
    const isLight = root.getAttribute('data-theme') === 'light';
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const progress = entry.target.querySelector('.progress-bar span');
        if (progress) {
          progress.style.width = progress.getAttribute('data-width') + '%';
        }
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.skill-card, .project-card, .achieve-card, .certificate-card, .timeline').forEach((item) => observer.observe(item));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-target'));
      let current = 0;
      const duration = 1200;
      const start = performance.now();
      const step = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        current = Math.floor(progress * target);
        el.textContent = current;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? scrollTop / height : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
    backToTop?.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();

  document.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    body.style.setProperty('--mouse-x', `${x}%`);
    body.style.setProperty('--mouse-y', `${y}%`);
  });

  const words = ['Software Engineering Undergraduate', 'Web Developer', 'Java Developer', 'Problem Solver'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  function typeLoop() {
    const currentWord = words[wordIndex];
    if (!typedText) return;
    typedText.textContent = currentWord.slice(0, charIndex);
    if (!deleting && charIndex < currentWord.length) {
      charIndex += 1;
      setTimeout(typeLoop, 90);
    } else if (!deleting && charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeLoop, 1000);
    } else if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(typeLoop, 55);
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeLoop, 280);
    }
  }
  typeLoop();

  navbarToggler?.addEventListener('click', () => {
    navbarCollapse?.classList.toggle('show');
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) navbarCollapse?.classList.remove('show');
    });
  });

  chatToggle?.addEventListener('click', () => {
    chatPanel?.classList.toggle('open');
  });
  chatClose?.addEventListener('click', () => chatPanel?.classList.remove('open'));

  const responses = {
    hello: 'Hello! I can share details about Chamidu’s skills, projects, and academic background.',
    skill: 'Chamidu is strong in Java, Python, Spring Boot, HTML, CSS, UI/UX, and responsive design.',
    project: 'One featured project is the premium portfolio website you are viewing right now.',
    contact: 'You can reach him at chamidukanishka85@gmail.com or call +94 77285347.',
    default: 'I can help with skills, projects, education, or contact details for Chamidu Kanishka.'
  };

  chatForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = chatInput.value.trim();
    if (!value) return;
    appendMessage(value, 'user');
    const lower = value.toLowerCase();
    let reply = responses.default;
    if (lower.includes('hello') || lower.includes('hi')) reply = responses.hello;
    else if (lower.includes('skill') || lower.includes('skills')) reply = responses.skill;
    else if (lower.includes('project') || lower.includes('projects')) reply = responses.project;
    else if (lower.includes('contact') || lower.includes('email')) reply = responses.contact;
    setTimeout(() => appendMessage(reply, 'assistant'), 300);
    chatInput.value = '';
  });

  function appendMessage(text, type) {
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.textContent = text;
    chatBody?.appendChild(message);
    chatBody?.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' });
  }

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button');
    if (button) {
      button.textContent = 'Message Sent';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = 'Send Message';
        button.disabled = false;
        contactForm.reset();
      }, 1800);
    }
  });
});
