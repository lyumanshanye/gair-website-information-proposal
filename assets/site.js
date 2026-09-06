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
      <a href="../research/index.html"${active('research')}>Research</a>
      <a href="../people/index.html"${active('people')}>People</a>
      <a href="../index.html#resources">Resources</a>
      <a href="../news/index.html"${active('updates')}>Updates</a>
      <a href="https://github.com/GAIR-NLP" target="_blank" rel="noopener">GitHub ↗</a>
      <a class="nav-cta" href="../contact/index.html">Join us</a>
    </div>
  </nav>`;
  document.body.prepend(header);
}

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
