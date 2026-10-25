(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menú móvil
  const boton = $('#menuBoton'), menu = $('#menu');
  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto);
  });
  $$('a', menu).forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('abierto');
    boton.setAttribute('aria-expanded', false);
  }));

  // Video de portada
  const video = $('.portada-video'), pausa = $('#videoPausa');
  if (reducir) video.pause();
  const textoPausa = () => pausa.textContent = video.paused ? 'Reproducir video' : 'Pausar video';
  pausa.addEventListener('click', () => { video.paused ? video.play() : video.pause(); textoPausa(); });
  textoPausa();

  // Barra de progreso y botón de subir
  const barra = $('#progreso'), subir = $('#subir');
  const alDesplazar = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    subir.hidden = scrollY < 600;
  };
  addEventListener('scroll', alDesplazar, { passive: true });
  alDesplazar();
  subir.addEventListener('click', () => scrollTo({ top: 0, behavior: reducir ? 'auto' : 'smooth' }));

  // Enlace activo del menú
  const enlaces = $$('nav a[href^="#"]');
  const vigilar = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) enlaces.forEach(a => a.classList.toggle('activo', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => vigilar.observe(s));

  // Contador de cifras
  const contar = el => {
    const meta = +el.dataset.cuenta, sin = 'sinComa' in el.dataset;
    const fmt = n => sin ? n : n.toLocaleString('en-US');
    if (reducir) return;
    const t0 = performance.now(), dur = 1200;
    const paso = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(Math.round(meta * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  const cifras = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { $$('[data-cuenta]', e.target).forEach(contar); o.unobserve(e.target); }
  }), { threshold: .5 });
  cifras.observe($('.cifras'));

  // Buscador de especialidades
  const tarjetas = $$('#rejilla li'), vacio = $('#vacio');
  const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  $('#buscador').addEventListener('input', e => {
    const q = norm(e.target.value.trim());
    let visibles = 0;
    tarjetas.forEach(li => {
      const ok = norm(li.textContent).includes(q);
      li.hidden = !ok;
      if (ok) visibles++;
    });
    vacio.hidden = visibles > 0;
  });

  // Línea del tiempo: un año abierto a la vez
  const botones = $$('#cronologia button');
  botones.forEach(b => b.addEventListener('click', () => {
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    botones.forEach(o => { o.setAttribute('aria-expanded', false); o.nextElementSibling.hidden = true; });
    b.setAttribute('aria-expanded', abrir);
    b.nextElementSibling.hidden = !abrir;
  }));

  // Acordeón: una pregunta abierta a la vez
  const detalles = $$('#acordeon details');
  detalles.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) detalles.forEach(o => { if (o !== d) o.open = false; });
  }));

  // Visor de galería
  const visor = $('#visor'), imgVisor = $('img', visor);
  $$('.galeria img').forEach(img => {
    img.tabIndex = 0;
    const abrir = () => { imgVisor.src = img.src; imgVisor.alt = img.alt; visor.showModal(); };
    img.addEventListener('click', abrir);
    img.addEventListener('keydown', e => { if (e.key === 'Enter') abrir(); });
  });
  $('#cerrarVisor').addEventListener('click', () => visor.close());
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });

  // Formulario: valida y abre el correo
  const form = $('#formulario'), error = $('#error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const { nombre, correo, mensaje } = form.elements;
    if (!nombre.value.trim() || !mensaje.value.trim()) { error.textContent = 'Escribe tu nombre y tu mensaje.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(correo.value)) { error.textContent = 'Escribe un correo válido, por ejemplo nombre@correo.com.'; return; }
    error.textContent = '';
    const cuerpo = `${mensaje.value}\n\n${nombre.value} (${correo.value})`;
    location.href = `mailto:plantel.reynosa@itace.edu.mx?subject=${encodeURIComponent('Consulta desde la página')}&body=${encodeURIComponent(cuerpo)}`;
  });
})();