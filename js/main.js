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

const SETTINGS_KEY = 'stoski_site_settings_v1';
const ANALYTICS_KEY = 'stoski_analytics_v1';
const DEFAULT_WHATSAPP = '5515997411289';

const DEFAULT_SETTINGS = {
  heroTitle: 'Histórias que você <em>sente</em> antes de entender.',
  heroText: 'Fotografia, filmes e produção audiovisual com olhar autoral, movimento e emoção.',
  aboutTitle: 'A arte de ver diferente.',
  aboutLead: 'Stoski Films é o olhar de Henrique Stoski sobre pessoas, encontros e histórias.',
  whatsapp: DEFAULT_WHATSAPP,
  instagram: 'https://www.instagram.com/stoski_films/',
  projects: {
    '1': {
      title: 'Histórias a dois',
      category: 'Filmes & Fotografia',
      subtitle: 'Casamentos · Celebrações',
      image: 'assets/media/casamento.webp',
      story: 'Um registro pensado para guardar a atmosfera, os detalhes e a emoção de uma celebração a dois. Filme e fotografia se encontram para transformar o momento em memória.'
    },
    '2': {
      title: 'Presença',
      category: 'Retratos',
      subtitle: 'Ensaios · Pessoas',
      image: 'assets/media/retrato.webp',
      story: 'Retratos com direção leve e atenção à personalidade de quem está diante da câmera. A proposta é criar imagens naturais, fortes e com identidade.'
    },
    '3': {
      title: 'Movimento',
      category: 'Histórias',
      subtitle: 'Eventos · Momentos',
      image: 'assets/media/evento.webp',
      story: 'Cobertura audiovisual para registrar movimento, energia e os detalhes que fazem um evento ter personalidade. Uma narrativa feita para ser lembrada.'
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
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
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
  document.querySelector('#story-image').src = project.image;
  document.querySelector('#story-image').alt = project.title;
  document.querySelector('#story-category').textContent = project.category;
  document.querySelector('#story-title').textContent = project.title;
  document.querySelector('#story-subtitle').textContent = project.subtitle;
  document.querySelector('#story-text').textContent = project.story;
  analytics.projects[id] = (analytics.projects[id] || 0) + 1;
  saveAnalytics();
  storyModal.showModal();
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
  if (field.id === 'whatsapp' && value && value.replace(/\D/g, '').length < 10) message = 'Informe um WhatsApp válido.';
  wrap.classList.toggle('invalid', Boolean(message));
  error.textContent = message;
  return !message;
}
form?.querySelectorAll('input,select,textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => { if (field.closest('.field')?.classList.contains('invalid')) validateField(field); });
});

function formatDateBR(rawDate) {
  const [year, month, day] = rawDate.split('-');
  return `${day}/${month}/${year}`;
}
function buildWhatsAppMessage(data) {
  const lines = [
    'Olá, Henrique! Vim pelo site da *Stoski Films* e gostaria de solicitar um orçamento. 🎬',
    '',
    `*Nome:* ${data.get('name')}`,
    `*Meu WhatsApp:* ${data.get('whatsapp')}`,
    `*Serviço:* ${data.get('service')}`,
    `*Data do evento:* ${formatDateBR(String(data.get('date')))}`,
    `*Horário do evento:* ${data.get('time')}`,
    `*Cidade / local:* ${data.get('city')}`,
  ];
  const details = String(data.get('message') || '').trim();
  if (details) lines.push(`*Detalhes:* ${details}`);
  lines.push('', 'Gostaria de saber se você tem disponibilidade nessa data e qual seria o orçamento.');
  return lines.join('\n');
}

form?.addEventListener('submit', event => {
  event.preventDefault();
  const required = [...form.querySelectorAll('[required]')];
  const valid = required.map(validateField).every(Boolean);
  if (!valid) {
    status.textContent = 'Revise os campos destacados antes de continuar.';
    form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea')?.focus();
    return;
  }
  if (!dateInput?.value || !timeInput?.value) {
    status.textContent = 'Informe a data e o horário do evento.';
    return;
  }
  const data = new FormData(form);
  const message = buildWhatsAppMessage(data);
  const number = String(siteSettings.whatsapp || DEFAULT_WHATSAPP).replace(/\D/g, '');
  const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
  status.textContent = 'Abrindo o WhatsApp do Henrique com sua solicitação pronta…';
  const popup = window.open(url, '_blank');
  if (popup) {
    try { popup.opener = null; } catch (_) {}
  } else {
    window.location.href = url;
  }
});
