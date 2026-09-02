'use strict';

(function () {
  const SUPABASE_URL = 'https://yncspxfsvlqdnodlsosb.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_jALAHHuvrV5oxj2mugWTCQ_stD_vFyN';
  const CACHE_KEY = 'stoski_public_config_v2';

  if (!window.supabase?.createClient) return;

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  const q = (selector, scope = document) => scope.querySelector(selector);
  const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function text(selector, value) {
    const el = q(selector);
    if (el && value !== undefined && value !== null) el.textContent = String(value);
  }

  function attr(selector, name, value) {
    const el = q(selector);
    if (el && value) el.setAttribute(name, value);
  }

  function safeUrl(value, fallback = '#') {
    if (!value) return fallback;
    const v = String(value).trim();
    if (/^(https?:\/\/|#|\/|assets\/)/i.test(v)) return v;
    return fallback;
  }

  function applyTheme(theme = {}, meta = {}) {
    const root = document.documentElement;
    if (theme.background) root.style.setProperty('--bg', theme.background);
    if (theme.surface) root.style.setProperty('--bg-2', theme.surface);
    if (theme.text) root.style.setProperty('--text', theme.text);
    if (theme.muted) root.style.setProperty('--muted', theme.muted);
    if (theme.accent) {
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--accent-light', theme.accent);
    }
    if (meta.themeColor) {
      const tag = q('meta[name="theme-color"]');
      if (tag) tag.content = meta.themeColor;
    }
  }

  function applyMeta(meta = {}) {
    if (meta.title) document.title = meta.title;
    if (meta.description) {
      const d = q('meta[name="description"]');
      if (d) d.content = meta.description;
      const og = q('meta[property="og:description"]');
      if (og) og.content = meta.description;
    }
  }

  function applyBrand(brand = {}) {
    if (brand.logo) {
      qa('.brand-logo, .footer-logo').forEach(img => { img.src = safeUrl(brand.logo, img.src); });
    }
    text('.footer-brand > span', brand.location);
  }

  function applyHero(hero = {}) {
    text('.hero .eyebrow', hero.eyebrow);
    const h1 = q('#hero-title');
    if (h1) {
      h1.textContent = '';
      h1.append(document.createTextNode(hero.titleBefore || ''));
      const em = document.createElement('em');
      em.textContent = hero.titleEmphasis || '';
      h1.append(em);
    }
    text('.hero-text', hero.text);
    const primary = q('.hero-actions .btn-primary');
    if (primary) {
      primary.textContent = hero.primaryLabel || primary.textContent;
      primary.href = safeUrl(hero.primaryHref, '#trabalhos');
    }
    const secondary = q('.hero-actions .btn-ghost');
    if (secondary) {
      secondary.textContent = hero.secondaryLabel || secondary.textContent;
      secondary.href = safeUrl(hero.secondaryHref, '#orcamento');
    }
    const proof = q('.hero-proof');
    if (proof && Array.isArray(hero.proof)) {
      proof.replaceChildren(...hero.proof.map(item => {
        const span = document.createElement('span');
        span.textContent = item;
        return span;
      }));
    }
  }

  function applyManifesto(manifesto = {}) {
    text('.manifesto .section-kicker', manifesto.kicker);
    text('.manifesto-copy h2', manifesto.title);
    text('.manifesto-copy p', manifesto.text);
  }

  function applyPortfolio(portfolio = {}, social = {}) {
    text('.work .section-kicker', portfolio.kicker);
    text('#work-title', portfolio.title);
    const more = q('.work .text-link');
    if (more) {
      more.textContent = portfolio.instagramLabel || 'Ver mais no Instagram ↗';
      more.href = safeUrl(social.instagramUrl, more.href);
    }

    const grid = q('.work-grid');
    if (!grid || !Array.isArray(portfolio.items)) return;

    grid.innerHTML = portfolio.items.map((item, index) => {
      const id = String(item.id || index + 1);
      const large = index === 0 ? ' work-card-large' : '';
      const mediaClass = index === 0 ? 'media-wedding' : index === 1 ? 'media-portrait' : 'media-story';
      const image = safeUrl(item.image, 'assets/logo-mark.svg');
      return '<article class="work-card' + large + ' reveal visible" tabindex="0" role="button" data-project="' + escapeHtml(id) + '" aria-label="Abrir história: ' + escapeHtml(item.title || '') + '">' +
        '<div class="media-placeholder ' + mediaClass + '"><img class="work-image" src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.title || 'Projeto Stoski Films') + '" loading="lazy" decoding="async"><span>' + String(index + 1).padStart(2, '0') + '</span></div>' +
        '<div class="work-meta"><p>' + escapeHtml(item.category || '') + '</p><h3>' + escapeHtml(item.title || '') + '</h3><span>' + escapeHtml(item.subtitle || '') + '</span><b class="work-open">Ver história ↗</b></div>' +
      '</article>';
    }).join('');
  }

  function applyServices(services = {}) {
    text('.services-intro .section-kicker', services.kicker);
    text('#services-title', services.title);
    text('.services-note', services.note);
    const list = q('.services-list');
    if (!list || !Array.isArray(services.items)) return;
    list.innerHTML = services.items.map((item, index) =>
      '<article class="service-row reveal visible"><span>' + String(index + 1).padStart(2, '0') + '</span><h3>' +
      escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.description || '') + '</p></article>'
    ).join('');
  }

  function applyAbout(about = {}, social = {}) {
    text('.about-copy .section-kicker', about.kicker);
    text('#about-title', about.title);
    text('.about-lead', about.lead);
    const body = qa('.about-copy > p:not(.section-kicker):not(.about-lead)')[0];
    if (body && about.text !== undefined) body.textContent = about.text;
    const img = q('.henrique-photo');
    if (img && about.image) {
      img.src = safeUrl(about.image, img.src);
      img.alt = (about.name || 'Henrique Stoski') + ', ' + (about.role || 'Videomaker');
    }
    const caption = q('.about-portrait > p');
    if (caption) {
      caption.innerHTML = escapeHtml(about.name || '') + '<br>' + escapeHtml(about.role || '');
    }
    const insta = q('.about-copy .text-link');
    if (insta) {
      insta.textContent = (social.instagramHandle || '@stoski_films') + ' ↗';
      insta.href = safeUrl(social.instagramUrl, insta.href);
    }
  }

  function applyDifferentials(items = []) {
    const grid = q('.trust-grid');
    if (!grid || !Array.isArray(items)) return;
    grid.innerHTML = items.map((item, index) =>
      '<article class="reveal visible"><span>' + String(index + 1).padStart(2, '0') + '</span><strong>' +
      escapeHtml(item.title || '') + '</strong><p>' + escapeHtml(item.text || '') + '</p></article>'
    ).join('');
  }

  function applyProcess(process = {}) {
    text('.process .section-kicker', process.kicker);
    text('#process-title', process.title);
    const grid = q('.process-grid');
    if (!grid || !Array.isArray(process.items)) return;
    grid.innerHTML = process.items.map((item, index) =>
      '<li class="reveal visible"><span>' + String(index + 1).padStart(2, '0') + '</span><h3>' +
      escapeHtml(item.title || '') + '</h3><p>' + escapeHtml(item.text || '') + '</p></li>'
    ).join('');
  }

  function applyFaq(faq = {}) {
    text('.faq-intro .section-kicker', faq.kicker);
    text('#faq-title', faq.title);
    text('.faq-intro > p:not(.section-kicker)', faq.intro);
    const list = q('.faq-list');
    if (!list || !Array.isArray(faq.items)) return;
    list.innerHTML = faq.items.map(item =>
      '<details><summary>' + escapeHtml(item.question || '') + '</summary><p>' + escapeHtml(item.answer || '') + '</p></details>'
    ).join('');
  }

  function applySocial(social = {}) {
    text('.social-showcase .section-kicker', social.showcaseKicker);
    text('#social-title', social.showcaseTitle);
    text('.social-showcase p:not(.section-kicker)', social.showcaseText);

    qa('a[href*="instagram.com"], .social-showcase .btn').forEach(link => {
      link.href = safeUrl(social.instagramUrl, link.href);
    });
    const showBtn = q('.social-showcase .btn');
    if (showBtn) showBtn.textContent = (social.instagramHandle || '@stoski_films') + ' ↗';

    const cards = qa('.budget .instagram-card');
    if (cards[0]) {
      const strong = q('strong', cards[0]);
      if (strong) strong.textContent = social.instagramHandle || '';
      cards[0].href = safeUrl(social.instagramUrl, cards[0].href);
    }
    if (cards[1]) {
      const strong = q('strong', cards[1]);
      if (strong) strong.textContent = social.whatsappDisplay || '';
      cards[1].href = whatsappUrl(social.whatsappNumber, 'Olá, Henrique! Vi seu site e gostaria de solicitar um orçamento.');
    }

    const float = q('#whatsapp-float');
    if (float) float.href = whatsappUrl(social.whatsappNumber, 'Olá, Henrique! Vi seu site e gostaria de conversar sobre um vídeo.');

    const footerWhats = q('.footer-links a[href*="api.whatsapp.com"]');
    if (footerWhats) footerWhats.href = whatsappUrl(social.whatsappNumber, '');
  }

  function applyBudget(budget = {}) {
    text('.budget-intro .section-kicker', budget.kicker);
    text('#budget-title', budget.title);
    text('.budget-intro > p:not(.section-kicker)', budget.intro);
    const select = q('#service');
    if (select && Array.isArray(budget.serviceOptions)) {
      select.innerHTML = '<option value="">Selecione</option>' + budget.serviceOptions.map(item =>
        '<option>' + escapeHtml(item) + '</option>'
      ).join('');
    }
  }

  function applyFooter(footer = {}) {
    const copy = q('.footer-bottom > span:first-child');
    if (copy) copy.innerHTML = '© <span id="year">' + new Date().getFullYear() + '</span> ' + escapeHtml(footer.copyright || 'Stoski Films.');
    const credit = q('.credit a');
    if (credit) {
      credit.textContent = footer.creditLabel || 'InfoTech.io';
      credit.href = safeUrl(footer.creditUrl, credit.href);
    }
  }

  function applyVisibility(visibility = {}) {
    const map = {
      manifesto: '.manifesto',
      portfolio: '.work',
      services: '.services',
      about: '.about',
      differentials: '.trust-strip',
      process: '.process',
      quote: '.quote-band',
      faq: '.faq',
      socialShowcase: '.social-showcase',
      budget: '.budget'
    };
    Object.entries(map).forEach(([key, selector]) => {
      const el = q(selector);
      if (!el || visibility[key] === undefined) return;
      el.hidden = visibility[key] === false;
    });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[ch]));
  }

  function whatsappUrl(number, message) {
    const digits = String(number || '').replace(/\D/g, '');
    return 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(digits) + (message ? '&text=' + encodeURIComponent(message) : '');
  }

  function applyConfig(config) {
    if (!config || typeof config !== 'object') return;
    applyTheme(config.theme, config.meta);
    applyMeta(config.meta);
    applyBrand(config.brand);
    applyHero(config.hero);
    applyManifesto(config.manifesto);
    applyPortfolio(config.portfolio, config.social);
    applyServices(config.services);
    applyAbout(config.about, config.social);
    applyDifferentials(config.differentials);
    applyProcess(config.process);
    text('.quote-band p', config.quote ? '“' + config.quote + '”' : '');
    applyFaq(config.faq);
    applySocial(config.social);
    applyBudget(config.budget);
    applyFooter(config.footer);
    applyVisibility(config.visibility);
    window.STOSKI_CONFIG = config;
    document.dispatchEvent(new CustomEvent('stoski:config', { detail: config }));
  }

  async function boot() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) applyConfig(JSON.parse(cached));
    } catch (_) {}

    try {
      const { data, error } = await client
        .from('stoski_site_config')
        .select('data,revision,updated_at')
        .eq('id', 1)
        .single();
      if (error) throw error;
      if (data?.data) {
        applyConfig(data.data);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data.data)); } catch (_) {}
      }
    } catch (error) {
      console.warn('[Stoski CMS] Usando conteúdo local porque o conteúdo remoto não pôde ser carregado.', error?.message || error);
    }
  }

  boot();
})();
