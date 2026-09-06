const grid = document.querySelector('#people-grid');
const count = document.querySelector('#people-count');
const search = document.querySelector('#people-search');
const chips = [...document.querySelectorAll('[data-filter]')];
let active = 'All';

const groupZh = {
  PhD: '博士生',
  Master: '硕士生',
  RA: '研究助理',
  Undergraduate: '本科生',
  Alumni: '校友'
};

function roleInChinese(role) {
  return role
    .replace('Incoming PhD', '即将入学博士生')
    .replace('Incoming Master', '即将入学硕士生')
    .replace('Research Assistant', '研究助理')
    .replace('Undergraduate', '本科生')
    .replace('Master', '硕士生')
    .replace('PhD', '博士生')
    .replace('Reasoning', '推理')
    .replace('Evaluation', '评测')
    .replace('Generation', '生成')
    .replace('Pre-training', '预训练')
    .replace('Information Extraction', '信息抽取')
    .replace('Interpretability', '可解释性')
    .replace('Text Summarization', '文本摘要')
    .replace('Summarization', '摘要')
    .replace('Generalization', '泛化')
    .replace('Factuality', '事实性')
    .replace('Performance Prediction', '性能预测')
    .replace('Annotation Platform', '标注平台');
}

function card(person) {
  const chinese = window.GAIR_LANGUAGE === 'zh';
  const role = chinese ? roleInChinese(person.role) : person.role;
  const group = chinese ? (groupZh[person.group] || person.group) : person.group;
  const content = `<img src="pic/${person.image}" alt="${person.name}" loading="lazy"><div class="people-card-copy"><h3>${person.name}</h3><p>${role}</p><span>${group}</span></div>`;
  return person.link
    ? `<a class="people-card" href="${person.link}" target="_blank" rel="noopener">${content}<b aria-hidden="true">↗</b></a>`
    : `<article class="people-card">${content}</article>`;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const rows = window.GAIR_PEOPLE.filter((person) =>
    (active === 'All' || person.group === active) &&
    (!query || `${person.name} ${person.role} ${person.group} ${roleInChinese(person.role)} ${groupZh[person.group] || ''}`.toLowerCase().includes(query))
  );
  grid.innerHTML = rows.map(card).join('');
  count.textContent = window.GAIR_LANGUAGE === 'zh'
    ? `共 ${rows.length} 位成员`
    : `${rows.length} ${rows.length === 1 ? 'person' : 'people'}`;
  document.querySelector('#people-empty').hidden = rows.length !== 0;
}

chips.forEach((chip) => chip.addEventListener('click', () => {
  active = chip.dataset.filter;
  chips.forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
  render();
}));
search.addEventListener('input', render);
window.addEventListener('gair:languagechange', render);
render();
