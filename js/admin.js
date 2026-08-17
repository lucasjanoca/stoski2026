const SETTINGS_KEY = 'stoski_site_settings_v1';
const ANALYTICS_KEY = 'stoski_analytics_v1';
const SESSION_KEY = 'stoski_admin_session';
const TEMP_USER = 'admin';
const TEMP_PASS = '123';

const DEFAULT_SETTINGS = {
  heroTitle: 'Histórias que você <em>sente</em> antes de entender.',
  heroText: 'Fotografia, filmes e produção audiovisual com olhar autoral, movimento e emoção.',
  aboutTitle: 'A arte de ver diferente.',
  aboutLead: 'Stoski Films é o olhar de Henrique Stoski sobre pessoas, encontros e histórias.',
  whatsapp: '5515997411289',
  instagram: 'https://www.instagram.com/stoski_films/',
  projects: {
    '1': { title: 'Histórias a dois', category: 'Filmes & Fotografia', subtitle: 'Casamentos · Celebrações', image: 'assets/media/casamento.webp', story: 'Um registro pensado para guardar a atmosfera, os detalhes e a emoção de uma celebração a dois. Filme e fotografia se encontram para transformar o momento em memória.' },
    '2': { title: 'Presença', category: 'Retratos', subtitle: 'Ensaios · Pessoas', image: 'assets/media/retrato.webp', story: 'Retratos com direção leve e atenção à personalidade de quem está diante da câmera. A proposta é criar imagens naturais, fortes e com identidade.' },
    '3': { title: 'Movimento', category: 'Histórias', subtitle: 'Eventos · Momentos', image: 'assets/media/evento.webp', story: 'Cobertura audiovisual para registrar movimento, energia e os detalhes que fazem um evento ter personalidade. Uma narrativa feita para ser lembrada.' }
  }
};

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (_) { return fallback; }
}
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
function merge(base, extra) {
  const out = clone(base);
  if (!extra) return out;
  for (const [key, value] of Object.entries(extra)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && out[key] && typeof out[key] === 'object') out[key] = merge(out[key], value);
    else out[key] = value;
  }
  return out;
}

const loginSection = document.querySelector('#admin-login');
const panel = document.querySelector('#admin-panel');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const settingsForm = document.querySelector('#settings-form');
const projectsEditor = document.querySelector('#projects-editor');
const saveStatus = document.querySelector('#save-status');

function showPanel(logged) {
  loginSection.hidden = logged;
  panel.hidden = !logged;
  if (logged) renderEditor();
}

loginForm?.addEventListener('submit', event => {
  event.preventDefault();
  const user = document.querySelector('#admin-user').value.trim();
  const pass = document.querySelector('#admin-pass').value;
  if (user === TEMP_USER && pass === TEMP_PASS) {
    sessionStorage.setItem(SESSION_KEY, '1');
    loginError.textContent = '';
    showPanel(true);
  } else {
    loginError.textContent = 'Usuário ou senha incorretos.';
  }
});

document.querySelector('#logout-btn')?.addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  showPanel(false);
});

function renderStats() {
  const data = merge({ siteVisits: 0, projects: { '1': 0, '2': 0, '3': 0 } }, readJson(ANALYTICS_KEY, {}));
  document.querySelector('#stat-visits').textContent = data.siteVisits || 0;
  document.querySelector('#stat-p1').textContent = data.projects['1'] || 0;
  document.querySelector('#stat-p2').textContent = data.projects['2'] || 0;
  document.querySelector('#stat-p3').textContent = data.projects['3'] || 0;
}

function projectEditorHtml(id, p) {
  return `
    <article class="project-editor" data-project-editor="${id}">
      <div class="project-editor-preview"><img src="${p.image}" alt="Prévia ${id}" onerror="this.style.opacity='.25'"><span>0${id}</span></div>
      <div class="project-editor-fields">
        <label>Título<input name="project_${id}_title" value="${escapeHtml(p.title)}"></label>
        <label>Categoria<input name="project_${id}_category" value="${escapeHtml(p.category)}"></label>
        <label>Subtítulo<input name="project_${id}_subtitle" value="${escapeHtml(p.subtitle)}"></label>
        <label>Imagem<input name="project_${id}_image" value="${escapeHtml(p.image)}"><small>Use um caminho do site (ex.: assets/media/foto.webp) ou uma URL HTTPS.</small></label>
        <label>História<textarea name="project_${id}_story" rows="5">${escapeHtml(p.story)}</textarea></label>
      </div>
    </article>`;
}
function escapeHtml(value = '') {
  return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderEditor() {
  const settings = merge(DEFAULT_SETTINGS, readJson(SETTINGS_KEY, {}));
  settingsForm.elements.heroTitle.value = settings.heroTitle;
  settingsForm.elements.heroText.value = settings.heroText;
  settingsForm.elements.aboutTitle.value = settings.aboutTitle;
  settingsForm.elements.aboutLead.value = settings.aboutLead;
  settingsForm.elements.whatsapp.value = settings.whatsapp;
  settingsForm.elements.instagram.value = settings.instagram;
  projectsEditor.innerHTML = ['1','2','3'].map(id => projectEditorHtml(id, settings.projects[id])).join('');
  projectsEditor.querySelectorAll('input[name$="_image"]').forEach(input => {
    input.addEventListener('input', () => {
      const card = input.closest('.project-editor');
      const img = card.querySelector('img');
      img.style.opacity = '1';
      img.src = input.value.trim();
    });
  });
  renderStats();
}

settingsForm?.addEventListener('submit', event => {
  event.preventDefault();
  const f = new FormData(settingsForm);
  const next = {
    heroTitle: String(f.get('heroTitle') || '').trim(),
    heroText: String(f.get('heroText') || '').trim(),
    aboutTitle: String(f.get('aboutTitle') || '').trim(),
    aboutLead: String(f.get('aboutLead') || '').trim(),
    whatsapp: String(f.get('whatsapp') || '').replace(/\D/g,''),
    instagram: String(f.get('instagram') || '').trim(),
    projects: {}
  };
  ['1','2','3'].forEach(id => {
    next.projects[id] = {
      title: String(f.get(`project_${id}_title`) || '').trim(),
      category: String(f.get(`project_${id}_category`) || '').trim(),
      subtitle: String(f.get(`project_${id}_subtitle`) || '').trim(),
      image: String(f.get(`project_${id}_image`) || '').trim(),
      story: String(f.get(`project_${id}_story`) || '').trim()
    };
  });
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  saveStatus.textContent = 'Alterações salvas neste navegador. Abra o site para conferir.';
  setTimeout(() => saveStatus.textContent = '', 4500);
});

document.querySelector('#reset-btn')?.addEventListener('click', () => {
  if (!confirm('Restaurar todos os textos e projetos para o padrão de teste?')) return;
  localStorage.removeItem(SETTINGS_KEY);
  renderEditor();
  saveStatus.textContent = 'Configuração padrão restaurada.';
});

showPanel(sessionStorage.getItem(SESSION_KEY) === '1');
