(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Navegación por vistas (#hash) ----------
  const vistas = $$('.vista');
  const enlaces = $$('nav a[href^="#"]');
  const menu = $('#menu'), botonMenu = $('#menuBoton'), mas = $('.mas');

  function mostrar(esInicial) {
    const id = location.hash.slice(1);
    const vista = vistas.find(v => v.id === id) || vistas[0];
    vistas.forEach(v => v.classList.toggle('activa', v === vista));
    enlaces.forEach(a => a.hash === '#' + vista.id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    document.title = `${vista.dataset.titulo} | ITACE Digital 4.0 (propuesta académica no oficial)`;
    menu.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    mas.open = false;
    scrollTo({ top: 0, behavior: 'auto' });
    if (!esInicial) $('#contenido').focus({ preventScroll: true });
    if (vista.id === 'inicio') contar();
  }
  addEventListener('hashchange', () => mostrar(false));

  botonMenu.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', abierto);
  });

  // ---------- Contadores de la portada ----------
  let contado = false;
  function contar() {
    if (contado || reducir) return;
    contado = true;
    $$('[data-cuenta]').forEach(el => {
      const meta = +el.dataset.cuenta, sin = 'sinComa' in el.dataset, t0 = performance.now();
      const paso = t => {
        const p = Math.min((t - t0) / 1200, 1), n = Math.round(meta * (1 - Math.pow(1 - p, 3)));
        el.textContent = sin ? n : n.toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  }

  // ---------- Línea del tiempo ----------
  const botones = $$('#cronologia button');
  botones.forEach(b => b.addEventListener('click', () => {
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    botones.forEach(o => { o.setAttribute('aria-expanded', 'false'); o.nextElementSibling.hidden = true; });
    b.setAttribute('aria-expanded', abrir);
    b.nextElementSibling.hidden = !abrir;
  }));

  // ---------- Directorio docente (datos/docentes.json) ----------
  const lista = $('#listaDocentes'), sin = $('#sinDocentes'), conteo = $('#conteo');
  const bNombre = $('#bNombre'), bMateria = $('#bMateria'), bAcademia = $('#bAcademia'), bSemestre = $('#bSemestre');
  let docentes = [];
  const norm = t => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const el = (tag, props = {}, ...hijos) => { const e = Object.assign(document.createElement(tag), props); e.append(...hijos); return e; };
  const fila = (etiqueta, valor) => {
    const vacio = !valor;
    return el('p', { className: 'fila' }, el('span', {}, etiqueta), el('b', { className: vacio ? 'pendiente' : '' }, vacio ? '[Pendiente]' : valor));
  };

  function tarjeta(d) {
    const foto = d.foto
      ? el('img', { src: d.foto, alt: `Fotografía de ${d.nombre}`, loading: 'lazy', width: 300, height: 400 })
      : el('div', { className: 'sin-foto', textContent: 'Foto pendiente' });
    const sems = d.semestres.map(s => s + '.°').join(', ');
    return el('article', { className: 'docente' }, el('div', { className: 'docente-foto' }, foto),
      el('div', { className: 'docente-datos' }, el('h3', {}, d.nombre),
        fila('Área académica', d.academia), fila('Materias que imparte', d.materias.join(', ')),
        fila('Semestres', sems), fila('Perfil profesional', d.perfil)));
  }

  function filtrar() {
    const n = norm(bNombre.value.trim()), m = norm(bMateria.value.trim()), a = bAcademia.value, s = bSemestre.value;
    const res = docentes.filter(d =>
      norm(d.nombre).includes(n) &&
      (!m || d.materias.some(x => norm(x).includes(m))) &&
      (!a || d.academia === a) &&
      (!s || d.semestres.map(String).includes(s)));
    lista.replaceChildren(...res.map(tarjeta));
    sin.hidden = res.length > 0;
    conteo.textContent = `${res.length} de ${docentes.length} docentes`;
  }

  fetch('datos/docentes.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(datos => {
      docentes = datos;
      const unicos = campo => [...new Set(datos.flatMap(d => [].concat(d[campo])).filter(Boolean))].sort();
      unicos('academia').forEach(v => bAcademia.append(el('option', { value: v, textContent: v })));
      unicos('materias').forEach(v => $('#listaMaterias').append(el('option', { value: v })));
      filtrar();
    })
    .catch(() => { conteo.textContent = 'No se pudo cargar el directorio de docentes en este momento.'; });

  [bNombre, bMateria].forEach(i => i.addEventListener('input', filtrar));
  [bAcademia, bSemestre].forEach(i => i.addEventListener('change', filtrar));
  $('#filtros').addEventListener('reset', () => setTimeout(filtrar));
  $('#filtros').addEventListener('submit', e => e.preventDefault());

  // ---------- Galería: filtros y visor con anterior/siguiente ----------
  const chips = $$('.chip'), figuras = $$('#galeriaGrid figure');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(o => { o.classList.toggle('activo', o === c); o.setAttribute('aria-pressed', o === c); });
    figuras.forEach(f => f.hidden = c.dataset.cat !== 'todas' && f.dataset.cat !== c.dataset.cat);
  }));
  const visor = $('#visor'), imgVisor = $('img', visor);
  let visibles = [], pos = 0;
  const pintar = () => {
    const f = visibles[pos], img = $('img', f);
    imgVisor.src = img.src; imgVisor.alt = img.alt;
    $('#visorPie').textContent = `${$('figcaption', f).textContent} (${pos + 1}/${visibles.length})`;
  };
  const mover = d => { pos = (pos + d + visibles.length) % visibles.length; pintar(); };
  figuras.forEach(f => {
    const img = $('img', f);
    img.tabIndex = 0;
    const abrir = () => { visibles = figuras.filter(x => !x.hidden); pos = visibles.indexOf(f); pintar(); visor.showModal(); };
    img.addEventListener('click', abrir);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
  });
  $('#prevVisor').addEventListener('click', () => mover(-1));
  $('#nextVisor').addEventListener('click', () => mover(1));
  visor.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') mover(-1); if (e.key === 'ArrowRight') mover(1); });
  $('#cerrarVisor').addEventListener('click', () => visor.close());
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });

  // ---------- Videos: uno a la vez, sin reproducción automática ----------
  const videos = $$('main video');
  videos.forEach(v => v.addEventListener('play', () => videos.forEach(o => { if (o !== v) o.pause(); })));

  // ---------- Formulario ----------
  const form = $('#formulario'), error = $('#error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const { nombre, correo, mensaje } = form.elements;
    if (!nombre.value.trim() || !mensaje.value.trim()) { error.textContent = 'Escribe tu nombre y tu mensaje.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(correo.value)) { error.textContent = 'Escribe un correo válido, por ejemplo nombre@correo.com.'; return; }
    error.textContent = '';
    location.href = `mailto:plantel.reynosa@itace.edu.mx?subject=${encodeURIComponent('Consulta desde la propuesta ITACE Digital')}&body=${encodeURIComponent(mensaje.value + '\n\n' + nombre.value + ' (' + correo.value + ')')}`;
  });

  // ---------- Volver arriba ----------
  const subir = $('#subir');
  addEventListener('scroll', () => { subir.hidden = scrollY < 600; }, { passive: true });
  subir.addEventListener('click', () => scrollTo({ top: 0, behavior: reducir ? 'auto' : 'smooth' }));

  mostrar(true);
})();