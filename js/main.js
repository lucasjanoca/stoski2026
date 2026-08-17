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

const WHATSAPP_NUMBER = '5515997411289';

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

if (dateInput) {
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  dateInput.min = localToday.toISOString().slice(0, 10);
}

function setMenu(open) {
  if (!menuToggle || !nav) return;
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
menuBackdrop?.addEventListener('click', () => setMenu(false));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMenu(false);
}, { passive: true });

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

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

function formatBrazilianPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

phoneInput?.addEventListener('input', event => {
  event.target.value = formatBrazilianPhone(event.target.value);
});

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
  field.addEventListener('input', () => {
    if (field.closest('.field')?.classList.contains('invalid')) validateField(field);
  });
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
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

  status.textContent = 'Abrindo o WhatsApp do Henrique com sua solicitação pronta…';

  const popup = window.open(url, '_blank');
  if (popup) {
    try { popup.opener = null; } catch (_) {}
  } else {
    window.location.href = url;
  }
});
