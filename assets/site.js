const LANGUAGE_KEY = 'gair-language';
const initialLanguage = localStorage.getItem(LANGUAGE_KEY) || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');

if (document.body.classList.contains('legacy-page') && !document.querySelector('.site-header')) {
  const path = window.location.pathname;
  const current = path.includes('/people/') ? 'people' : path.includes('/research/') ? 'research' : path.includes('/news/') ? 'updates' : '';
  const active = (name) => current === name ? ' aria-current="page"' : '';
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `<nav class="nav-shell" aria-label="Primary navigation">
    <a class="brand" href="../index.html" aria-label="GAIR home"><span class="brand-mark"><img src="../fig/balloon.png" alt="" width="44" height="44"></span><span>GAIR<small>Generative AI Research Lab</small></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Open navigation">Menu</button>
    <div class="nav-links" id="nav-links">
      <a href="../research/index.html"${active('research')} data-en="Research" data-zh="研究">Research</a>
      <a href="../people/index.html"${active('people')} data-en="People" data-zh="成员">People</a>
      <a href="../index.html#resources" data-en="Resources" data-zh="资源">Resources</a>
      <a href="https://gair-nlp.github.io/cs2916/docs/category/2025" target="_blank" rel="noopener" data-en="Teaching ↗" data-zh="课程 ↗">Teaching ↗</a>
      <a href="../news/index.html"${active('updates')} data-en="Updates" data-zh="动态">Updates</a>
      <a href="https://github.com/GAIR-NLP" target="_blank" rel="noopener">GitHub ↗</a>
      <a href="https://huggingface.co/GAIR" target="_blank" rel="noopener">Hugging Face ↗</a>
      <a class="nav-cta" href="../contact/index.html#admissions" data-en="Admissions" data-zh="招生说明">Admissions</a>
    </div>
  </nav>`;
  document.body.prepend(header);
}

const languageButton = document.createElement('button');
languageButton.className = 'lang-toggle';
languageButton.type = 'button';
const navLinks = document.querySelector('.nav-links');
if (navLinks) {
  const primaryAction = navLinks.querySelector('.nav-cta');
  navLinks.insertBefore(languageButton, primaryAction || null);
}

function applyLanguage(language) {
  const selected = language === 'zh' ? 'zh' : 'en';
  document.documentElement.lang = selected === 'zh' ? 'zh-CN' : 'en';
  document.body.classList.toggle('lang-zh', selected === 'zh');
  document.querySelectorAll('[data-en][data-zh]').forEach((node) => {
    const value = node.dataset[selected];
    if (node.hasAttribute('data-i18n-html')) node.innerHTML = value;
    else node.textContent = value;
  });
  document.querySelectorAll('[data-en-placeholder][data-zh-placeholder]').forEach((node) => {
    node.placeholder = node.dataset[`${selected}Placeholder`];
  });
  document.querySelectorAll('[data-en-alt][data-zh-alt]').forEach((node) => {
    node.alt = node.dataset[`${selected}Alt`];
  });
  const title = document.body.dataset[`title${selected === 'zh' ? 'Zh' : 'En'}`];
  const description = document.body.dataset[`description${selected === 'zh' ? 'Zh' : 'En'}`];
  if (title) document.title = title;
  if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  languageButton.textContent = selected === 'zh' ? 'EN' : '中文';
  languageButton.setAttribute('aria-label', selected === 'zh' ? 'Switch to English' : '切换到中文');
  localStorage.setItem(LANGUAGE_KEY, selected);
  window.GAIR_LANGUAGE = selected;
  window.dispatchEvent(new CustomEvent('gair:languagechange', { detail: { language: selected } }));
}

languageButton.addEventListener('click', () => applyLanguage(window.GAIR_LANGUAGE === 'zh' ? 'en' : 'zh'));
applyLanguage(initialLanguage);

const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const flowCanvas = document.querySelector('[data-flow-field]');
if (flowCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const context = flowCanvas.getContext('2d');
  const particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let running = true;

  const resetParticle = (particle, anywhere = false) => {
    particle.x = anywhere ? Math.random() * width : -30;
    particle.y = Math.random() * height;
    particle.speed = .26 + Math.random() * .34;
    particle.life = 150 + Math.random() * 170;
    particle.age = anywhere ? Math.random() * particle.life : 0;
    particle.width = .55 + Math.random() * .75;
    particle.alpha = .045 + Math.random() * .065;
    particle.trail = [];
  };

  const resizeFlow = () => {
    const bounds = flowCanvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    flowCanvas.width = Math.round(width * pixelRatio);
    flowCanvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const targetCount = width < 700 ? 26 : 54;
    particles.length = 0;
    for (let index = 0; index < targetCount; index += 1) {
      const particle = {};
      resetParticle(particle, true);
      particles.push(particle);
    }
  };

  const drawFlow = (time = 0) => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      const xRatio = particle.x / Math.max(width, 1);
      const yRatio = particle.y / Math.max(height, 1);
      const angle = Math.sin(xRatio * 7.2 + time * .00016) * .36
        + Math.cos(yRatio * 8.4 - time * .00012) * .3;
      particle.x += (.75 + Math.cos(angle)) * particle.speed;
      particle.y += Math.sin(angle) * particle.speed * 1.8;
      particle.age += 1;
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 28) particle.trail.shift();

      if (particle.trail.length > 2) {
        context.beginPath();
        context.moveTo(particle.trail[0].x, particle.trail[0].y);
        particle.trail.slice(1).forEach((point) => context.lineTo(point.x, point.y));
        const fade = Math.min(1, particle.age / 36) * Math.min(1, (particle.life - particle.age) / 36);
        context.strokeStyle = `rgba(51, 117, 198, ${Math.max(0, particle.alpha * fade)})`;
        context.lineWidth = particle.width;
        context.stroke();
      }

      if (particle.x > width + 30 || particle.y < -30 || particle.y > height + 30 || particle.age >= particle.life) {
        resetParticle(particle);
      }
    });
    if (running) frame = window.requestAnimationFrame(drawFlow);
  };

  resizeFlow();
  frame = window.requestAnimationFrame(drawFlow);
  if ('ResizeObserver' in window) {
    const flowResizeObserver = new ResizeObserver(resizeFlow);
    flowResizeObserver.observe(flowCanvas);
  } else {
    window.addEventListener('resize', resizeFlow, { passive: true });
  }
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    window.cancelAnimationFrame(frame);
    if (running) frame = window.requestAnimationFrame(drawFlow);
  });
}

if (window.location.pathname.includes('/research/')) {
  document.querySelectorAll('a.btn').forEach((link) => {
    if (link.textContent.trim().toLowerCase() !== 'open') return;
    const href = link.href.toLowerCase();
    const label = href.includes('arxiv.org')
      ? 'Paper'
      : href.includes('github.com')
        ? 'Code'
        : href.includes('huggingface.co/datasets')
          ? 'Data'
          : href.includes('huggingface.co')
            ? 'Model'
            : 'Project';
    link.textContent = `${label} ↗`;
    link.target = '_blank';
    link.rel = 'noopener';
  });
}
