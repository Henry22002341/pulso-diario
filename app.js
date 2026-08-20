const seedStories = [
  { id: 1, topic: 'Ciudad', kicker: 'CIUDAD', title: 'El barrio que convirtió sus azoteas en pequeños parques', excerpt: 'Una red de vecinos recupera espacios olvidados y cambia la forma de vivir el verano.', time: '6 min', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82', body: 'La idea comenzó con tres macetas en una azotea compartida. Dos años después, más de veinte edificios participan en una red de sombra, huertos y encuentros vecinales. El proyecto demuestra que una ciudad también puede crecer hacia arriba.' },
  { id: 2, topic: 'Tecnología', kicker: 'TECNOLOGÍA', title: 'La tecnología que quiere devolvernos la atención', excerpt: 'Nuevas herramientas están diseñándose para reducir el ruido digital, no para capturarlo.', time: '4 min', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=82', body: 'Después de años midiendo cada segundo de pantalla, algunos equipos de diseño están cambiando la pregunta. En lugar de cómo conseguir más clics, estudian cómo ayudar a las personas a terminar una tarea y volver a su día.' },
  { id: 3, topic: 'Mundo', kicker: 'MUNDO', title: 'Una biblioteca flotante recorre el delta del río', excerpt: 'Libros, mapas y talleres llegan en barco a comunidades sin librería cercana.', time: '5 min', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=82', body: 'Cada semana, una embarcación de madera cambia su ruta para visitar una comunidad diferente. Lleva novelas, material escolar y un espacio para que los habitantes recomienden lecturas a los siguientes pasajeros.' },
  { id: 4, topic: 'Cultura', kicker: 'CULTURA', title: 'El sonido de una ciudad contado por sus mercados', excerpt: 'Una artista reúne voces, pregones y silencios en una pieza de audio inmersiva.', time: '7 min', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=82', body: 'La obra no intenta congelar la ciudad, sino escucharla mientras cambia. Cada grabación se realizó al amanecer, cuando los puestos abren y las conversaciones todavía no han encontrado su ritmo del día.' },
  { id: 5, topic: 'Ciudad', kicker: 'CIUDAD', title: 'Por qué las calles tranquilas también son infraestructura', excerpt: 'Menos tráfico no solo cambia el aire: cambia las conversaciones y los trayectos.', time: '3 min', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=82', body: 'Los primeros resultados de varias zonas de velocidad reducida apuntan a una mejora que no aparece en los mapas: las personas se quedan más tiempo en el espacio público.' },
  { id: 6, topic: 'Tecnología', kicker: 'FUTURO', title: 'La pequeña revolución de reparar en vez de reemplazar', excerpt: 'Talleres de barrio enseñan a alargar la vida de objetos cotidianos.', time: '5 min', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=82', body: 'Reparar vuelve a ser una habilidad compartida. Los nuevos talleres combinan herramientas, manuales abiertos y una regla simple: antes de comprar algo nuevo, intenta entender qué dejó de funcionar.' }
];

const storedStories = JSON.parse(localStorage.getItem('pulso-stories') || 'null');
const stories = storedStories || seedStories;
if (!storedStories) localStorage.setItem('pulso-stories', JSON.stringify(stories));
const defaultDeveloper = { id: 'dev-pulso', name: 'Editor Pulso', email: 'developer@pulso.local', password: 'pulso2026', role: 'developer' };
const users = JSON.parse(localStorage.getItem('pulso-users') || 'null') || [defaultDeveloper];
if (!users.some(user => user.email === defaultDeveloper.email)) users.push(defaultDeveloper);
localStorage.setItem('pulso-users', JSON.stringify(users));
const state = { topic: 'Todas', query: '', saved: JSON.parse(localStorage.getItem('pulso-saved') || '[]'), user: JSON.parse(localStorage.getItem('pulso-session') || 'null') };
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

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

function saveSession(user) { state.user = user; localStorage.setItem('pulso-session', JSON.stringify(user)); render(); }
function logout() { state.user = null; localStorage.removeItem('pulso-session'); render(); showToast('Sesión cerrada'); }

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
  $('#adminList').querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => { if (confirm('¿Borrar esta noticia?')) { const index = stories.findIndex(story => story.id === Number(button.dataset.delete)); stories.splice(index, 1); localStorage.setItem('pulso-stories', JSON.stringify(stories)); render(); renderAdmin(); showToast('Noticia borrada'); } }));
}

function openArticle(id) {
  const story = stories.find(item => item.id === id);
  if (!story) return;
  $('#dialogContent').innerHTML = `<img class="dialog-image" src="${story.image}" alt="${story.title}"><div class="dialog-body"><span class="card-kicker">${story.kicker} · ${story.time} DE LECTURA</span><h2>${story.title}</h2><p class="lead">${story.excerpt}</p><p class="article-copy">${story.body}</p><p class="article-copy">La historia continúa en los detalles: en las decisiones pequeñas, en los lugares que casi no aparecen y en las personas que hacen que una idea pueda durar más de una temporada.</p></div>`;
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
$('#authForm').addEventListener('submit', event => { event.preventDefault(); const mode = $('#authDialog').dataset.mode; const email = $('#authEmail').value.trim().toLowerCase(); const password = $('#authPassword').value; const currentUsers = JSON.parse(localStorage.getItem('pulso-users') || '[]'); if (mode === 'login') { const user = currentUsers.find(item => item.email === email && item.password === password); if (!user) return showToast('Email o contraseña incorrectos'); saveSession(user); $('#authDialog').close(); showToast(`Hola, ${user.name}`); } else { if (currentUsers.some(item => item.email === email)) return showToast('Ese email ya está registrado'); const user = { id: `user-${Date.now()}`, name: $('#authName').value.trim(), email, password, role: 'reader' }; if (!user.name || !password) return showToast('Completa todos los campos'); currentUsers.push(user); localStorage.setItem('pulso-users', JSON.stringify(currentUsers)); saveSession(user); $('#authDialog').close(); showToast('Cuenta creada'); } });
$('#developerLink').addEventListener('click', event => { event.preventDefault(); setDrawer(false); renderAdmin(); });
$('#newStoryButton').addEventListener('click', () => showEditor());
$('#storyForm').addEventListener('submit', event => { event.preventDefault(); const form = event.target; const id = Number($('#editorDialog').dataset.id); const story = { id: id || Date.now(), topic: form.topic.value, kicker: form.topic.value.toUpperCase(), title: form.title.value.trim(), excerpt: form.excerpt.value.trim(), time: form.time.value.trim(), image: form.image.value.trim(), body: form.body.value.trim() }; if (!story.title || !story.excerpt || !story.body) return showToast('Completa los campos principales'); const index = stories.findIndex(item => item.id === id); if (index >= 0) stories[index] = story; else stories.unshift(story); localStorage.setItem('pulso-stories', JSON.stringify(stories)); $('#editorDialog').close(); $('#adminDialog').close(); render(); showToast(index >= 0 ? 'Noticia actualizada' : 'Noticia publicada'); });

if (localStorage.getItem('pulso-theme') === 'dark') document.documentElement.classList.add('dark');
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
render();
