# ITACE Digital 4.0

Propuesta académica **no oficial** de portal para el ITACE plantel Reynosa.
Asignatura: Desarrollo Web · Grupo 502 B.

## Descripción
Sitio institucional de una sola página con vistas navegables (`#inicio`, `#conoce`, `#oferta`, `#docentes`, etc.) para no tener una página larga. Reúne historia, oferta educativa, directorio docente con buscador, himnos, galería multimedia, preguntas frecuentes y contacto.

## Objetivo
Modernizar la página anterior del ITACE con HTML semántico, CSS responsivo y JavaScript, cumpliendo los requisitos del proyecto ITACE Digital 4.0.

## Tecnologías
HTML5, CSS3 (variables, Grid, Flexbox, animaciones, media queries), JavaScript sin librerías, JSON, Git y GitHub.

## Estructura de archivos
```
index.html
css/style.css
js/script.js
datos/docentes.json
img/ (instalaciones, docentes, eventos, oferta)
audio/ (himno-itace.mp3, himno-tamaulipas.mp3)
videos/
evidencias/
README.md
```

## Funcionalidades
- Navegación por vistas con menú móvil y enlace activo.
- Directorio docente generado desde `datos/docentes.json`: búsqueda por nombre y materia, filtro por academia, mensaje sin coincidencias y botón para limpiar.
- Reproductores de ambos himnos, sin reproducción automática y con un solo audio activo a la vez.
- Galería con filtros por categoría y visor ampliado.
- Línea del tiempo, preguntas frecuentes y formulario que abre el correo.
- Accesibilidad: enlace para saltar al contenido, foco visible, textos alternativos y respeto a movimiento reducido.

## Instrucciones para ejecutar
El directorio carga un archivo JSON, por lo que debe abrirse desde un servidor y no con doble clic:
- Con VS Code: extensión *Live Server* → "Open with Live Server".
- O con Python: `python -m http.server` y abrir `http://localhost:8000`.
- Publicación de demostración: GitHub Pages.

## Pendientes por completar
Textos entre corchetes `[Agrega ...]`, listado autorizado de docentes, fotografías, audios, noticias, eventos, misión, visión y valores.

## Créditos
Fuentes: Decreto número 74 (1984) y Notas a los Estados Financieros del ITACE (transparencia.tamaulipas.gob.mx); Galería de Honor del Magisterio Tamaulipeco.

## Autoría
[Agrega los nombres de los autores]