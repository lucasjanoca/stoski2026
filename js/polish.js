(() => {
  const progress = document.querySelector('#scroll-progress');
  const headerLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const details = [...document.querySelectorAll('.faq-list details')];

  const updateProgress = () => {
    if (!progress) return;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    progress.style.width = pct + '%';
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  details.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      details.forEach(other => {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  if ('IntersectionObserver' in window) {
    const sections = headerLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const navObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const id = '#' + visible.target.id;
      headerLinks.forEach(link => {
        const active = link.getAttribute('href') === id;
        link.toggleAttribute('aria-current', active);
      });
    }, {
      threshold: [0.18, 0.35, 0.6],
      rootMargin: '-20% 0px -62% 0px'
    });

    sections.forEach(section => {
      if (section.id) navObserver.observe(section);
    });
  }
})();
