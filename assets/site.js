const LANGUAGE_KEY = 'gair-language';
const initialLanguage = localStorage.getItem(LANGUAGE_KEY) || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');

if (document.body.classList.contains('legacy-page') && !document.querySelector('.site-header')) {
  const path = window.location.pathname;
  const current = path.includes('/people/') ? 'people' : path.includes('/research/') ? 'research' : path.includes('/news/') ? 'updates' : '';
  const active = (name) => current === name ? ' aria-current="page"' : '';
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `<nav class="nav-shell" aria-label="Primary navigation">
    <a class="brand" href="../index.html" aria-label="GAIR home"><span class="brand-mark">G</span><span>GAIR<small>Generative AI Research Lab</small></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Open navigation">Menu</button>
    <div class="nav-links" id="nav-links">
      <a href="../research/index.html"${active('research')} data-en="Research" data-zh="研究">Research</a>
      <a href="../people/index.html"${active('people')} data-en="People" data-zh="成员">People</a>
      <a href="../index.html#resources" data-en="Resources" data-zh="资源">Resources</a>
      <a href="../news/index.html"${active('updates')} data-en="Updates" data-zh="动态">Updates</a>
      <a href="https://github.com/GAIR-NLP" target="_blank" rel="noopener">GitHub ↗</a>
      <a class="nav-cta" href="../contact/index.html" data-en="Join us" data-zh="加入我们">Join us</a>
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
