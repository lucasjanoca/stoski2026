'use strict';

let WHATSAPP_NUMBER = '5515997411289';
let INSTAGRAM_URL = 'https://www.instagram.com/stoski_films/';
let WHATSAPP_GREETING = 'Olá, Henrique! Vim pelo site da *Stoski Films* e gostaria de solicitar um orçamento. 🎬';

let PROJECTS = {
  '1': {
    title: 'Histórias a dois',
    category: 'Filme de casamento',
    subtitle: 'Casamentos · Love stories',
    image: 'assets/media/hero-casamento.webp',
    video: '',
    story: 'Um filme pensado para guardar a atmosfera, os detalhes e a emoção de uma celebração a dois. A narrativa transforma cada instante em uma história para reviver.'
  },
  '2': {
    title: 'Presença',
    category: 'Eventos',
    subtitle: 'Eventos · Celebrações',
    image: 'assets/media/evento.webp',
    video: '',
    story: 'Cobertura em vídeo para registrar energia, movimento e os detalhes que fazem um evento ter personalidade, com uma edição construída para manter a experiência viva.'
  },
  '3': {
    title: 'Movimento',
    category: 'Reels & comercial',
    subtitle: 'Marcas · Conteúdo vertical',
    image: 'assets/logo-mark.svg',
    video: '',
    story: 'Vídeos curtos e produções comerciais com ritmo, linguagem visual e acabamento para comunicar uma ideia com impacto.'
  }
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function applyRuntimeConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') return;
  if (cfg.social?.whatsappNumber) WHATSAPP_NUMBER = String(cfg.social.whatsappNumber).replace(/\D/g, '');
  if (cfg.social?.instagramUrl) INSTAGRAM_URL = String(cfg.social.instagramUrl);
  if (cfg.budget?.whatsappGreeting) WHATSAPP_GREETING = String(cfg.budget.whatsappGreeting);
  if (Array.isArray(cfg.portfolio?.items)) {
    PROJECTS = Object.fromEntries(cfg.portfolio.items.map((item, index) => {
      const id = String(item.id || index + 1);
      return [id, {
        title: item.title || '',
        category: item.category || '',
        subtitle: item.subtitle || '',
        image: item.image || 'assets/logo-mark.svg',
        video: item.video || '',
        story: item.story || ''
      }];
    }));
  }

  if (cfg.showreel) {
    PROJECTS.showreel = {
      title: cfg.showreel.title || 'Showreel Stoski Films',
      category: cfg.showreel.kicker || 'Showreel',
      subtitle: '',
      image: cfg.showreel.cover || 'assets/media/hero-casamento.webp',
      video: cfg.showreel.video || '',
      story: cfg.showreel.text || ''
    };
  }
  qsa('a[href*="instagram.com"]').forEach(link => { link.href = INSTAGRAM_URL; });
}

document.addEventListener('stoski:config', event => applyRuntimeConfig(event.detail));
if (window.STOSKI_CONFIG) applyRuntimeConfig(window.STOSKI_CONFIG);

const header = qs('.site-header');
const menuToggle = qs('.menu-toggle');
const nav = qs('.main-nav');
const menuBackdrop = qs('.menu-backdrop');
const form = qs('#budget-form');
const status = qs('#form-status');
const dateInput = qs('#date');
const phoneInput = qs('#whatsapp');
const storyModal = qs('#story-modal');
const videoModal = qs('#video-modal');
const portfolioVideo = qs('#portfolio-video');
const portfolioVideoEmbed = qs('#portfolio-video-embed');
const videoLoading = qs('#video-loading');
const progress = qs('#scroll-progress');
let menuScrollY = 0;
let lastStoryTrigger = null;

const year = qs('#year');
if (year) year.textContent = new Date().getFullYear();

if (dateInput) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);
}

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

menuToggle?.addEventListener('click', () => setMenu(!nav?.classList.contains('open')));
menuBackdrop?.addEventListener('click', () => setMenu(false));
qsa('.main-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  setMenu(false);
  if (storyModal?.open) storyModal.close();
  if (videoModal?.open) videoModal.close();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && nav?.classList.contains('open')) setMenu(false);
}, { passive: true });

function updateViewportEffects() {
  header?.classList.toggle('scrolled', window.scrollY > 24);
  if (!progress) return;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progress.style.width = Math.min(100, Math.max(0, (window.scrollY / max) * 100)) + '%';
}
updateViewportEffects();
window.addEventListener('scroll', updateViewportEffects, { passive: true });
window.addEventListener('resize', updateViewportEffects, { passive: true });

const revealEls = qsa('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px' });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

const navLinks = qsa('.main-nav a[href^="#"]');
if ('IntersectionObserver' in window) {
  const sections = navLinks
    .map(link => qs(link.getAttribute('href')))
    .filter(section => section?.id);
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const activeId = '#' + visible.target.id;
    navLinks.forEach(link => link.toggleAttribute('aria-current', link.getAttribute('href') === activeId));
  }, { threshold: [0.18,0.35,0.6], rootMargin: '-20% 0px -62% 0px' });
  sections.forEach(section => navObserver.observe(section));
}

qsa('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    qsa('.faq-list details').forEach(other => { if (other !== item) other.open = false; });
  });
});

document.addEventListener('toggle', event => {
  const item = event.target;
  if (!(item instanceof HTMLDetailsElement) || !item.matches('.faq-list details') || !item.open) return;
  qsa('.faq-list details').forEach(other => { if (other !== item) other.open = false; });
}, true);

function safeMediaUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw, window.location.href);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return url.href;
  } catch (_) {
    return '';
  }
}

function youtubeEmbedUrl(raw) {
  try {
    const url = new URL(raw);
    let id = '';
    if (url.hostname === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    if (url.hostname.endsWith('youtube.com')) {
      if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
      const parts = url.pathname.split('/').filter(Boolean);
      if (['shorts', 'embed'].includes(parts[0])) id = parts[1] || id;
    }
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return '';
    return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
  } catch (_) {
    return '';
  }
}

function vimeoEmbedUrl(raw) {
  try {
    const url = new URL(raw);
    if (!url.hostname.endsWith('vimeo.com')) return '';
    const id = url.pathname.split('/').filter(Boolean).find(part => /^\d+$/.test(part)) || '';
    if (!id) return '';
    return 'https://player.vimeo.com/video/' + encodeURIComponent(id) + '?autoplay=1&playsinline=1&dnt=1';
  } catch (_) {
    return '';
  }
}

function stopPortfolioVideo() {
  if (portfolioVideo) {
    try { portfolioVideo.pause(); } catch (_) {}
    portfolioVideo.removeAttribute('src');
    portfolioVideo.removeAttribute('poster');
    portfolioVideo.load();
    portfolioVideo.hidden = true;
  }
  if (portfolioVideoEmbed) {
    portfolioVideoEmbed.src = 'about:blank';
    portfolioVideoEmbed.hidden = true;
  }
  if (videoLoading) videoLoading.hidden = true;
}

async function openVideo(id, trigger) {
  const project = PROJECTS[id];
  if (!project || !videoModal) return;
  const raw = safeMediaUrl(project.video);
  if (!raw) return;

  lastStoryTrigger = trigger || lastStoryTrigger;
  stopPortfolioVideo();
  if (videoLoading) videoLoading.hidden = false;

  const youtube = youtubeEmbedUrl(raw);
  const vimeo = vimeoEmbedUrl(raw);

  if (youtube || vimeo) {
    if (!portfolioVideoEmbed) return;
    portfolioVideoEmbed.hidden = false;
    portfolioVideoEmbed.src = youtube || vimeo;
    portfolioVideoEmbed.onload = () => { if (videoLoading) videoLoading.hidden = true; };
  } else if (portfolioVideo) {
    portfolioVideo.hidden = false;
    portfolioVideo.poster = project.image || '';
    portfolioVideo.src = raw;
    portfolioVideo.oncanplay = () => { if (videoLoading) videoLoading.hidden = true; };
    portfolioVideo.onerror = () => {
      if (videoLoading) {
        videoLoading.hidden = false;
        videoLoading.textContent = 'Não foi possível reproduzir este vídeo.';
      }
    };
  }

  if (typeof videoModal.showModal === 'function') videoModal.showModal();
  else videoModal.setAttribute('open', '');

  if (!youtube && !vimeo && portfolioVideo) {
    try { await portfolioVideo.play(); } catch (_) {}
  }
}

function fillStory(id) {
  const project = PROJECTS[id];
  if (!project || !storyModal) return;
  const image=qs('#story-image'), category=qs('#story-category'), title=qs('#story-title'), subtitle=qs('#story-subtitle'), text=qs('#story-text');
  if (image) { image.src=project.image; image.alt=project.title; }
  if (category) category.textContent=project.category;
  if (title) title.textContent=project.title;
  if (subtitle) subtitle.textContent=project.subtitle;
  if (text) text.textContent=project.story;
}

function openStory(card) {
  const id = card?.dataset.project;
  if (!id || !PROJECTS[id] || !storyModal) return;
  lastStoryTrigger=card;
  fillStory(id);
  if (typeof storyModal.showModal === 'function') storyModal.showModal();
  else storyModal.setAttribute('open','');
  qs('.story-close',storyModal)?.focus();
}

document.addEventListener('click', event => {
  const play = event.target.closest('[data-video-project]');
  if (play) {
    event.preventDefault();
    event.stopPropagation();
    openVideo(play.dataset.videoProject, play);
    return;
  }

  const card = event.target.closest('.work-card[data-project]');
  if (card && !event.target.closest('#story-modal') && !event.target.closest('#video-modal')) openStory(card);
});

document.addEventListener('keydown', event => {
  if (!['Enter',' '].includes(event.key)) return;
  if (event.target.closest?.('[data-video-project]')) return;
  const card = event.target.closest?.('.work-card[data-project]');
  if (!card) return;
  event.preventDefault();
  openStory(card);
});

qs('.story-close',storyModal)?.addEventListener('click', () => storyModal.close());
qs('#story-budget')?.addEventListener('click', () => storyModal?.close());
storyModal?.addEventListener('close', () => lastStoryTrigger?.focus());
storyModal?.addEventListener('click', event => {
  const rect=storyModal.getBoundingClientRect();
  const inside=event.clientX>=rect.left && event.clientX<=rect.right && event.clientY>=rect.top && event.clientY<=rect.bottom;
  if (!inside) storyModal.close();
});

qs('.video-close',videoModal)?.addEventListener('click', () => videoModal.close());
videoModal?.addEventListener('close', () => {
  stopPortfolioVideo();
  lastStoryTrigger?.focus?.();
});
videoModal?.addEventListener('click', event => {
  const rect=videoModal.getBoundingClientRect();
  const inside=event.clientX>=rect.left && event.clientX<=rect.right && event.clientY>=rect.top && event.clientY<=rect.bottom;
  if (!inside) videoModal.close();
});

function formatBrazilianPhone(value) {
  const digits=value.replace(/\D/g,'').slice(0,11);
  if (digits.length<=2) return digits;
  if (digits.length<=6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length<=10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}
phoneInput?.addEventListener('input', event => { event.target.value=formatBrazilianPhone(event.target.value); });

function validateField(field) {
  const wrap=field.closest('.field');
  const error=wrap?.querySelector('.error');
  if (!wrap || !error) return true;
  const value=field.value.trim();
  let message='';
  if (field.required && !value) message='Preencha este campo.';
  if (field.id==='whatsapp' && value && value.replace(/\D/g,'').length<10) message='Informe um WhatsApp válido.';
  wrap.classList.toggle('invalid',Boolean(message));
  field.setAttribute('aria-invalid',String(Boolean(message)));
  error.textContent=message;
  return !message;
}

qsa('#budget-form input, #budget-form select, #budget-form textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.closest('.field')?.classList.contains('invalid')) validateField(field);
  });
});

function formatDateBR(raw) {
  if (!raw) return '';
  const [year,month,day]=raw.split('-');
  return year && month && day ? `${day}/${month}/${year}` : raw;
}

function buildWhatsAppMessage(data) {
  const lines=[
    WHATSAPP_GREETING,
    '',
    `*Nome:* ${data.get('name')}`,
    `*Meu WhatsApp:* ${data.get('whatsapp')}`,
    `*Serviço:* ${data.get('service')}`
  ];
  const date=String(data.get('date')||'').trim();
  const time=String(data.get('time')||'').trim();
  const city=String(data.get('city')||'').trim();
  const details=String(data.get('message')||'').trim();
  if (date) lines.push(`*Data desejada:* ${formatDateBR(date)}`);
  if (time) lines.push(`*Horário aproximado:* ${time}`);
  if (city) lines.push(`*Cidade / local:* ${city}`);
  if (details) lines.push(`*Detalhes:* ${details}`);
  lines.push('','Gostaria de saber sobre disponibilidade e orçamento para esse projeto.');
  return lines.join('\n');
}

form?.addEventListener('submit', event => {
  event.preventDefault();
  const required=qsa('[required]',form);
  const valid=required.map(validateField).every(Boolean);
  if (!valid) {
    if (status) status.textContent='Revise os campos destacados antes de continuar.';
    qs('.field.invalid input, .field.invalid select, .field.invalid textarea',form)?.focus();
    return;
  }
  const data=new FormData(form);
  const message=buildWhatsAppMessage(data);
  const url=`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  if (status) status.textContent='Abrindo o WhatsApp do Henrique com sua solicitação pronta…';
  const popup=window.open(url,'_blank','noopener,noreferrer');
  if (!popup) window.location.href=url;
});

qsa('a[href*="instagram.com/stoski_films"]').forEach(link => { link.href=INSTAGRAM_URL; });
