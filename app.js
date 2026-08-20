const seedStories = [
  { id: 1, topic: 'Ciudad', kicker: 'POSADAS', title: 'Más de 300 carreras y tres días para elegir qué estudiar', excerpt: 'La Expo Posadas Ciudad Universitaria reúne propuestas académicas en La Cascada del Parque La Cantera.', time: '3 min', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=82', body: 'La exposición comenzó el 19 de agosto y presenta más de 300 carreras durante tres jornadas. La propuesta busca acercar a estudiantes de Posadas y la región la oferta de educación superior.', source: 'https://www.primeraedicion.com.ar/nota/101133683/mas-de-300-carreras-y-tres-dias-para-elegir-que-estudiar-arranco-la-expo-universitaria/', sourceName: 'Primera Edición' },
  { id: 2, topic: 'Ciudad', kicker: 'POSADAS', title: 'Posadas reunirá a referentes del agro en una cumbre internacional', excerpt: 'El encuentro pondrá el foco en la producción sostenible y las economías regionales.', time: '4 min', image: 'https://images.unsplash.com/photo-1500382017468-9049fed54a8c?auto=format&fit=crop&w=1000&q=82', body: 'La ciudad será sede de una cumbre internacional sobre agricultura sostenible. La agenda reunirá a referentes del sector para debatir producción, innovación y desarrollo regional.', source: 'https://www.primeraedicion.com.ar/nota/101133816/posadas-cumbre-internacional-agricultura-sostenible-2026/', sourceName: 'Primera Edición' },
  { id: 3, topic: 'Misiones', kicker: 'MISIONES', title: 'Misiones busca cubrir hasta 500 kWh con el subsidio eléctrico', excerpt: 'La provincia consiguió un primer acuerdo dentro del nuevo esquema nacional de subsidios.', time: '5 min', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=82', body: 'El acuerdo apunta a sostener un nivel de cobertura de hasta 500 kWh para usuarios residenciales misioneros. La medida se analiza en el marco de los cambios nacionales en las tarifas eléctricas.', source: 'https://www.primeraedicion.com.ar/nota/101133647/misiones-subsidio-hasta-500-kwh-luz-tarifa-electrica/', sourceName: 'Primera Edición' },
  { id: 4, topic: 'Ciudad', kicker: 'POSADAS', title: 'Usuarios denunciaron sobrefacturación y EMSA respondió en Itaembé Guazú', excerpt: 'La empresa eléctrica explicó la situación ante reclamos de vecinos del barrio posadeño.', time: '4 min', image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=82', body: 'Vecinos de Itaembé Guazú plantearon reclamos por montos de facturación. EMSA brindó respuestas y explicó los pasos para revisar cada caso y solicitar asistencia.', source: 'https://www.lavozdemisiones.com/posadas/usuarios-denunciaron-sobrefacturacion-y-emsa-brindo-respuestas-en-itaembe-guazu/', sourceName: 'La Voz de Misiones' },
  { id: 5, topic: 'Cultura', kicker: 'CULTURA', title: 'Leandro Igounet llega este domingo a Tanta Tinta', excerpt: 'El comediante que describe lugares mientras corre presentará su espectáculo en Posadas.', time: '2 min', image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=900&q=82', body: 'El comediante y corredor Leandro Igounet visitará Posadas este domingo para presentar su espectáculo de stand up en Tanta Tinta.', source: 'https://www.lavozdemisiones.com/cultura/en-redes/leandro-igounet-el-comediante-que-corre-llega-este-domingo-a-tanta-tinta/', sourceName: 'La Voz de Misiones' },
  { id: 6, topic: 'Ciudad', kicker: 'COMUNIDAD', title: 'Reúnen donaciones para celebrar el Día del Niño en la Chacra 242', excerpt: 'La campaña busca alimentos, útiles y juguetes para una jornada comunitaria en Posadas.', time: '3 min', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=82', body: 'La campaña “Regalemos sonrisas, compartamos felicidad” reúne alimentos no perecederos, útiles escolares y juguetes para celebrar el domingo 30 de agosto junto a familias de la Chacra 242.', source: 'https://www.lavozdemisiones.com/informacion-general/reunen-donaciones-para-festejar-el-dia-del-nino-en-la-chacra-242-de-posadas/', sourceName: 'La Voz de Misiones' }
];

const newsVersion = 'posadas-2026-08-20';
const SUPABASE_URL = 'https://pmajshqvuvoaqcpfdibq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWpzaHF2dXZvYXFjcGZkaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTY4MzYsImV4cCI6MjEwMjc3MjgzNn0.w7W5g-VaLETWuGxlPb34aIa8S-Cs8ckxcp7UteP7vvk';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let stories = [];
const state = { topic: 'Todas', query: '', saved: JSON.parse(localStorage.getItem('pulso-saved') || '[]'), user: null };
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function storyFromRow(row) {
  return { ...row, sourceName: row.source_name };
}

async function loadStories() {
  const { data, error } = await supabaseClient.from('stories').select('*').order('created_at', { ascending: false });
  if (error) { showToast('No se pudieron cargar las noticias'); return; }
  stories = data.map(storyFromRow);
}

async function loadCurrentUser(sessionUser) {
  if (!sessionUser) { state.user = null; renderAccount(); return; }
  const { data: profile } = await supabaseClient.from('profiles').select('name, role').eq('id', sessionUser.id).single();
  state.user = { id: sessionUser.id, name: profile?.name || sessionUser.email.split('@')[0], email: sessionUser.email, role: profile?.role || 'reader' };
  renderAccount();
}

function filteredStories() {
  return stories.filter(story => {
    const matchesTopic = state.topic === 'Todas' || story.topic === state.topic;
    const haystack = `${story.title} ${story.excerpt} ${story.topic}`.toLowerCase();
    return matchesTopic && haystack.includes(state.query.toLowerCase());
  });
}

function render() {
  const items = filteredStories();
  const featured = items.slice(0, 3);
  $('#featureGrid').innerHTML = featured.length ? featured.map((story, index) => cardTemplate(story, index === 0)).join('') : emptyTemplate('No encontramos historias con esa búsqueda.');
  $('#storyList').innerHTML = items.slice(3).map(rowTemplate).join('') || (items.length ? '' : emptyTemplate('Prueba con otra palabra o sección.'));
  renderSaved();
  renderAccount();
  bindStoryEvents();
}

function renderAccount() {
  const user = state.user;
  $('#accountButton').textContent = user ? user.name.split(' ')[0] : 'Entrar';
  $('#accountStatus').innerHTML = user ? `<strong>${user.name}</strong><small>${user.role === 'developer' ? 'Cuenta developer' : 'Cuenta lectora'}</small><button class="drawer-action" id="logoutButton">Cerrar sesión</button>` : '<span>Guarda historias y accede a tu cuenta</span><button class="drawer-action" id="loginButton">Iniciar sesión</button>';
  $('#developerLink').hidden = !user || user.role !== 'developer';
  $('#logoutButton')?.addEventListener('click', logout);
  $('#loginButton')?.addEventListener('click', () => { setDrawer(false); openAuth('login'); });
}

function cardTemplate(story, featured) {
  return `<article class="card feature-card" data-id="${story.id}">
    <button class="save-button ${state.saved.includes(story.id) ? 'saved' : ''}" data-save="${story.id}" aria-label="${state.saved.includes(story.id) ? 'Quitar de guardados' : 'Guardar noticia'}">${state.saved.includes(story.id) ? '★' : '☆'}</button>
    <img class="card-image" src="${story.image}" alt="${story.title}" loading="${featured ? 'eager' : 'lazy'}">
    <div class="card-body"><span class="card-kicker">${story.kicker}</span><h3>${story.title}</h3><p>${story.excerpt}</p><div class="card-meta"><span>● ${story.time} de lectura</span><span>20 AGO 2026</span></div></div>
  </article>`;
}

function rowTemplate(story) {
  return `<article class="story-row" data-id="${story.id}"><img src="${story.image}" alt="" loading="lazy"><div><span class="card-kicker">${story.kicker}</span><h3>${story.title}</h3><p>${story.excerpt}</p></div><span class="row-arrow">→</span></article>`;
}

function savedCard(story) {
  return `<article class="card" data-id="${story.id}"><button class="save-button saved" data-save="${story.id}" aria-label="Quitar de guardados">★</button><img class="card-image" src="${story.image}" alt="${story.title}" loading="lazy"><div class="card-body"><span class="card-kicker">${story.kicker}</span><h3>${story.title}</h3><div class="card-meta"><span>${story.time} de lectura</span></div></div></article>`;
}

function emptyTemplate(message) { return `<div class="empty">${message}</div>`; }

function renderSaved() {
  const savedStories = stories.filter(story => state.saved.includes(story.id));
  $('#savedList').innerHTML = savedStories.length ? savedStories.map(savedCard).join('') : emptyTemplate('Aún no has guardado ninguna noticia. Pulsa ☆ en una historia para tenerla a mano.');
  $('#savedCount').textContent = savedStories.length;
}

function bindStoryEvents() {
  $$('[data-id]').forEach(element => element.addEventListener('click', event => {
    if (event.target.closest('[data-save]')) return;
    openArticle(Number(element.dataset.id));
  }));
  $$('[data-save]').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    toggleSaved(Number(button.dataset.save));
  }));
}

function toggleSaved(id) {
  state.saved = state.saved.includes(id) ? state.saved.filter(savedId => savedId !== id) : [...state.saved, id];
  localStorage.setItem('pulso-saved', JSON.stringify(state.saved));
  render();
  showToast(state.saved.includes(id) ? 'Guardado en tu archivo' : 'Quitado de guardados');
}

function openAuth(mode) {
  $('#authDialog').dataset.mode = mode;
  $('#authTitle').textContent = mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta';
  $('#authSubmit').textContent = mode === 'login' ? 'Entrar' : 'Crear cuenta';
  $('#nameField').hidden = mode === 'login';
  $('#authSwitch').innerHTML = mode === 'login' ? '¿Todavía no tienes cuenta? <button type="button" id="switchAuth">Regístrate</button>' : '¿Ya tienes cuenta? <button type="button" id="switchAuth">Inicia sesión</button>';
  $('#authDialog').showModal();
  $('#authEmail').focus();
  $('#switchAuth').addEventListener('click', () => openAuth(mode === 'login' ? 'register' : 'login'));
}

async function logout() { await supabaseClient.auth.signOut(); state.user = null; renderAccount(); showToast('Sesión cerrada'); }

function showEditor(story = null) {
  if (!state.user || state.user.role !== 'developer') return;
  $('#editorDialog').dataset.id = story?.id || '';
  $('#editorTitle').textContent = story ? 'Editar noticia' : 'Nueva noticia';
  ['title', 'topic', 'image', 'time', 'excerpt', 'body'].forEach(field => { $(`#story${field[0].toUpperCase()}${field.slice(1)}`).value = story?.[field] || ''; });
  $('#editorDialog').showModal();
}

function renderAdmin() {
  if (!state.user || state.user.role !== 'developer') return;
  $('#adminList').innerHTML = stories.map(story => `<div class="admin-row"><div><strong>${story.title}</strong><small>${story.topic} · ${story.time}</small></div><div><button class="mini-button" data-edit="${story.id}">Editar</button><button class="mini-button danger" data-delete="${story.id}">Borrar</button></div></div>`).join('');
  $('#adminDialog').showModal();
  $('#adminList').querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => showEditor(stories.find(story => story.id === Number(button.dataset.edit)))));
  $('#adminList').querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => { if (confirm('¿Borrar esta noticia?')) { const { error } = await supabaseClient.from('stories').delete().eq('id', Number(button.dataset.delete)); if (error) return showToast('No se pudo borrar la noticia'); await loadStories(); render(); renderAdmin(); showToast('Noticia borrada'); } }));
}

function openArticle(id) {
  const story = stories.find(item => item.id === id);
  if (!story) return;
  const sourceLink = story.source ? `<a class="source-link" href="${story.source}" target="_blank" rel="noopener">Leer fuente: ${story.sourceName}</a>` : '';
  $('#dialogContent').innerHTML = `<img class="dialog-image" src="${story.image}" alt="${story.title}"><div class="dialog-body"><span class="card-kicker">${story.kicker} · ${story.time} DE LECTURA</span><h2>${story.title}</h2><p class="lead">${story.excerpt}</p><p class="article-copy">${story.body}</p>${sourceLink}</div>`;
  $('#articleDialog').showModal();
}

function showToast(text) {
  const toast = $('#toast');
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

function setDrawer(open) {
  $('#drawer').classList.toggle('open', open);
  $('#scrim').classList.toggle('open', open);
  $('#drawer').setAttribute('aria-hidden', String(!open));
}

$$('[data-topic]').forEach(button => button.addEventListener('click', () => {
  state.topic = button.dataset.topic;
  $$('.topic').forEach(item => item.classList.toggle('active', item === button));
  render();
  $('#inicio').scrollIntoView({ behavior: 'smooth' });
}));

$('#searchButton').addEventListener('click', () => {
  const panel = $('#searchPanel');
  panel.classList.toggle('open');
  panel.setAttribute('aria-hidden', String(!panel.classList.contains('open')));
  if (panel.classList.contains('open')) $('#searchInput').focus();
});
$('#searchInput').addEventListener('input', event => { state.query = event.target.value.trim(); render(); });
$('#clearSearch').addEventListener('click', () => { $('#searchInput').value = ''; state.query = ''; render(); });
$('#menuButton').addEventListener('click', () => setDrawer(true));
$('#closeDrawer').addEventListener('click', () => setDrawer(false));
$('#scrim').addEventListener('click', () => setDrawer(false));
$$('.drawer [data-nav]').forEach(link => link.addEventListener('click', () => setDrawer(false)));
$('#dialogClose').addEventListener('click', () => $('#articleDialog').close());
$('#randomButton').addEventListener('click', () => openArticle(stories[Math.floor(Math.random() * stories.length)].id));
$('#themeButton').addEventListener('click', () => { document.documentElement.classList.toggle('dark'); localStorage.setItem('pulso-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light'); });
$('#latestButton').addEventListener('click', () => { state.topic = 'Todas'; state.query = ''; $('#searchInput').value = ''; $$('.topic').forEach(item => item.classList.toggle('active', item.dataset.topic === 'Todas')); render(); showToast('Mostrando todas las historias'); });
$('#accountButton').addEventListener('click', () => state.user ? setDrawer(true) : openAuth('login'));
$('#authForm').addEventListener('submit', async event => { event.preventDefault(); const mode = $('#authDialog').dataset.mode; const email = $('#authEmail').value.trim().toLowerCase(); const password = $('#authPassword').value; if (mode === 'login') { const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) return showToast('Email o contraseña incorrectos'); await loadCurrentUser(data.user); $('#authDialog').close(); showToast(`Hola, ${state.user.name}`); } else { const name = $('#authName').value.trim(); if (!name || !password) return showToast('Completa todos los campos'); const { data, error } = await supabaseClient.auth.signUp({ email, password, options: { data: { name } } }); if (error) return showToast(error.message); $('#authDialog').close(); if (data.session) { await loadCurrentUser(data.user); showToast('Cuenta creada'); } else showToast('Revisa tu email para confirmar la cuenta'); } });
$('#developerLink').addEventListener('click', event => { event.preventDefault(); setDrawer(false); renderAdmin(); });
$('#newStoryButton').addEventListener('click', () => showEditor());
$('#storyForm').addEventListener('submit', async event => { event.preventDefault(); const form = event.target; const id = Number($('#editorDialog').dataset.id); const payload = { topic: form.topic.value, kicker: form.topic.value.toUpperCase(), title: form.title.value.trim(), excerpt: form.excerpt.value.trim(), time: form.time.value.trim(), image: form.image.value.trim(), body: form.body.value.trim() }; if (!payload.title || !payload.excerpt || !payload.body) return showToast('Completa los campos principales'); const result = id ? await supabaseClient.from('stories').update(payload).eq('id', id) : await supabaseClient.from('stories').insert(payload); if (result.error) return showToast('No se pudo guardar la noticia'); await loadStories(); $('#editorDialog').close(); $('#adminDialog').close(); render(); showToast(id ? 'Noticia actualizada' : 'Noticia publicada'); });

if (localStorage.getItem('pulso-theme') === 'dark') document.documentElement.classList.add('dark');
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(registrations.map(registration => registration.unregister()))).then(() => caches?.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))));
supabaseClient.auth.onAuthStateChange((_event, session) => loadCurrentUser(session?.user || null));
(async function init() { await loadStories(); const { data } = await supabaseClient.auth.getSession(); await loadCurrentUser(data.session?.user || null); render(); })();
