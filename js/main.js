const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const menuBackdrop = document.querySelector('.menu-backdrop');
const revealEls = document.querySelectorAll('.reveal');
const form = document.querySelector('#budget-form');
const status = document.querySelector('#form-status');
const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const phoneInput = document.querySelector('#whatsapp');
const storyModal = document.querySelector('#story-modal');

const SETTINGS_KEY = 'stoski_site_settings_v2';
const ANALYTICS_KEY = 'stoski_analytics_v1';
const DEFAULT_WHATSAPP = '5515997411289';

const DEFAULT_SETTINGS = {
  heroTitle: 'Transformo momentos em <em>filmes que ficam.</em>',
  heroText: 'Filmes de casamento, eventos e produções audiovisuais com narrativa, ritmo e emoção.',
  aboutTitle: 'A arte de ver diferente.',
  aboutLead: 'Stoski Films é o olhar de Henrique Stoski transformado em movimento, som e narrativa.',
  whatsapp: DEFAULT_WHATSAPP,
  instagram: 'https://www.instagram.com/stoski_films/',
  projects: {
    '1': {
      title: 'Histórias a dois',
      category: 'Filme de casamento',
      subtitle: 'Casamentos · Love stories',
      image: 'assets/media/hero-casamento.webp',
      story: 'Um filme pensado para guardar a atmosfera, os detalhes e a emoção de uma celebração a dois. A narrativa transforma cada instante em uma história para reviver.'
    },
    '2': {
      title: 'Presença',
      category: 'Eventos',
      subtitle: 'Eventos · Celebrações',
      image: 'assets/media/evento.webp',
      story: 'Cobertura em vídeo para registrar energia, movimento e os detalhes que fazem um evento ter personalidade, com uma edição construída para manter a experiência viva.'
    },
    '3': {
      title: 'Movimento',
      category: 'Conteúdo audiovisual',
      subtitle: 'Reels · Comercial',
      image: 'assets/media/retrato.webp',
      story: 'Vídeos curtos e produções comerciais com ritmo, linguagem visual e acabamento para comunicar uma ideia com impacto.'
    }
  }
};

function readJson(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function deepMerge(base, extra) {
  const out = typeof structuredClone === 'function' ? structuredClone(base) : JSON.parse(JSON.stringify(base));
  if (!extra) return out;
  Object.keys(extra).forEach(key => {
    if (extra[key] && typeof extra[key] === 'object' && !Array.isArray(extra[key]) && out[key] && typeof out[key] === 'object') {
      out[key] = deepMerge(out[key], extra[key]);
    } else {
      out[key] = extra[key];
    }
  });
  return out;
}

const siteSettings = deepMerge(DEFAULT_SETTINGS, readJson(SETTINGS_KEY, {}));
const analytics = deepMerge({ siteVisits: 0, projects: { '1': 0, '2': 0, '3': 0 } }, readJson(ANALYTICS_KEY, {}));

function saveAnalytics() {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (_) {}
}

if (!sessionStorage.getItem('stoski_visit_counted')) {
  analytics.siteVisits += 1;
  saveAnalytics();
  sessionStorage.setItem('stoski_visit_counted', '1');
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

function applySettings() {
  document.querySelectorAll('[data-edit]').forEach(el => {
    const key = el.dataset.edit;
    if (siteSettings[key]) el.innerHTML = siteSettings[key];
  });

  document.querySelectorAll('.work-card[data-project]').forEach(card => {
    const id = card.dataset.project;
    const project = siteSettings.projects[id];
    if (!project) return;
    const title = card.querySelector('[data-project-field="title"]');
    const category = card.querySelector('[data-project-field="category"]');
    const subtitle = card.querySelector('[data-project-field="subtitle"]');
    const image = card.querySelector('.work-image');
    if (title) title.textContent = project.title;
    if (category) category.textContent = project.category;
    if (subtitle) subtitle.textContent = project.subtitle;
    if (image) {
      image.src = project.image;
      image.alt = project.title;
    }
    card.setAttribute('aria-label', `Abrir história: ${project.title}`);
  });

  document.querySelectorAll('a[href*="instagram.com/stoski_films"]').forEach(a => a.href = siteSettings.instagram);
  const whatsNumber = String(siteSettings.whatsapp || DEFAULT_WHATSAPP).replace(/\D/g, '');
  const float = document.querySelector('#whatsapp-float');
  if (float) {
    float.href = `https://api.whatsapp.com/send?phone=${whatsNumber}&text=${encodeURIComponent('Olá, Henrique! Vi seu site e gostaria de conversar sobre um vídeo.')}`;
  }
}
applySettings();

if (dateInput) {
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  dateInput.min = localToday.toISOString().slice(0, 10);
}

let menuScrollY = 0;
function setMenu(open) {
  if (!menuToggle || !nav) return;
  if (open) {
    menuScrollY = window.scrollY;
    document.body.style.top = `-${menuScrollY}px`;
    document.body.classList.add('menu-open');
  } else if (document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, menuScrollY);
  }
  nav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuBackdrop?.setAttribute('tabindex', open ? '0' : '-1');
}
menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
menuBackdrop?.addEventListener('click', () => setMenu(false));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setMenu(false);
    if (storyModal?.open) storyModal.close();
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); }, { passive: true });
window.addEventListener('scroll', () => { header?.classList.toggle('scrolled', window.scrollY > 24); }, { passive: true });

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px' });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

function openStory(id) {
  const project = siteSettings.projects[id];
  if (!storyModal || !project) return;
  const storyImage = document.querySelector('#story-image');
  const storyCategory = document.querySelector('#story-category');
  const storyTitle = document.querySelector('#story-title');
  const storySubtitle = document.querySelector('#story-subtitle');
  const storyText = document.querySelector('#story-text');

  if (storyImage) {
    storyImage.src = project.image;
    storyImage.alt = project.title;
  }
  if (storyCategory) storyCategory.textContent = project.category;
  if (storyTitle) storyTitle.textContent = project.title;
  if (storySubtitle) storySubtitle.textContent = project.subtitle;
  if (storyText) storyText.textContent = project.story;

  analytics.projects[id] = (analytics.projects[id] || 0) + 1;
  saveAnalytics();
  storyModal.showModal();
  storyModal.querySelector('.story-close')?.focus();
}

document.querySelectorAll('.work-card[data-project]').forEach(card => {
  card.addEventListener('click', () => openStory(card.dataset.project));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openStory(card.dataset.project);
    }
  });
});
storyModal?.querySelector('.story-close')?.addEventListener('click', () => storyModal.close());
storyModal?.addEventListener('click', event => {
  const rect = storyModal.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) storyModal.close();
});
document.querySelector('#story-budget')?.addEventListener('click', () => storyModal.close());

function formatBrazilianPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
phoneInput?.addEventListener('input', event => { event.target.value = formatBrazilianPhone(event.target.value); });

function validateField(field) {
  const wrap = field.closest('.field');
  const error = wrap?.querySelector('.error');
  if (!wrap || !error) return true;
  let message = '';
  const value = field.value.trim();

  if (field.required && !value) message = 'Preencha este campo.';
  if (field.id === 'whatsapp' && value && value.replace(/\D/g, '').length < 10) {
    message = 'Informe um WhatsApp válido.';
  }

  wrap.classList.toggle('invalid', Boolean(message));
  error.textContent = message;
  return !message;
}
form?.querySelectorAll('input,select,textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.closest('.field')?.classList.contains('invalid')) validateField(field);
  });
});

function formatDateBR(rawDate) {
  if (!rawDate) return '';
  const [year, month, day] = rawDate.split('-');
  return year && month && day ? `${day}/${month}/${year}` : rawDate;
}

function buildWhatsAppMessage(data) {
  const lines = [
    'Olá, Henrique! Vim pelo site da *Stoski Films* e gostaria de solicitar um orçamento. 🎬',
    '',
    `*Nome:* ${data.get('name')}`,
    `*Meu WhatsApp:* ${data.get('whatsapp')}`,
    `*Serviço:* ${data.get('service')}`
  ];

  const date = String(data.get('date') || '').trim();
  const time = String(data.get('time') || '').trim();
  const city = String(data.get('city') || '').trim();
  const details = String(data.get('message') || '').trim();

  if (date) lines.push(`*Data desejada:* ${formatDateBR(date)}`);
  if (time) lines.push(`*Horário aproximado:* ${time}`);
  if (city) lines.push(`*Cidade / local:* ${city}`);
  if (details) lines.push(`*Detalhes:* ${details}`);

  lines.push('', 'Gostaria de saber sobre disponibilidade e orçamento para esse projeto.');
  return lines.join('\n');
}

form?.addEventListener('submit', event => {
  event.preventDefault();
  const required = [...form.querySelectorAll('[required]')];
  const valid = required.map(validateField).every(Boolean);

  if (!valid) {
    if (status) status.textContent = 'Revise os campos destacados antes de continuar.';
    form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea')?.focus();
    return;
  }

  const data = new FormData(form);
  const message = buildWhatsAppMessage(data);
  const number = String(siteSettings.whatsapp || DEFAULT_WHATSAPP).replace(/\D/g, '');
  const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;

  if (status) status.textContent = 'Abrindo o WhatsApp do Henrique com sua solicitação pronta…';

  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) window.location.href = url;
});
