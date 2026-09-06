const grid = document.querySelector('#people-grid');
const count = document.querySelector('#people-count');
const search = document.querySelector('#people-search');
const chips = [...document.querySelectorAll('[data-filter]')];
let active = 'All';

function card(person) {
  const content = `<img src="pic/${person.image}" alt="${person.name}" loading="lazy"><div class="people-card-copy"><h3>${person.name}</h3><p>${person.role}</p><span>${person.group}</span></div>`;
  return person.link
    ? `<a class="people-card" href="${person.link}" target="_blank" rel="noopener">${content}<b aria-hidden="true">↗</b></a>`
    : `<article class="people-card">${content}</article>`;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const rows = window.GAIR_PEOPLE.filter((person) =>
    (active === 'All' || person.group === active) &&
    (!query || `${person.name} ${person.role} ${person.group}`.toLowerCase().includes(query))
  );
  grid.innerHTML = rows.map(card).join('');
  count.textContent = `${rows.length} ${rows.length === 1 ? 'person' : 'people'}`;
  document.querySelector('#people-empty').hidden = rows.length !== 0;
}

chips.forEach((chip) => chip.addEventListener('click', () => {
  active = chip.dataset.filter;
  chips.forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
  render();
}));
search.addEventListener('input', render);
render();
