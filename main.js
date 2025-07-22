// Se ejecuta cuando el HTML ha sido completamente cargado y parseado.
document.addEventListener('DOMContentLoaded', () => {

  // Seleccionamos todos los enlaces de navegación y las secciones de contenido.
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');

  // Añadimos un 'escuchador de eventos' a cada enlace del menú.
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      // 1. Prevenimos el comportamiento por defecto del enlace (que es saltar).
      event.preventDefault(); 

      // Obtenemos el ID de la sección a mostrar desde el 'href' del enlace clickeado.
      // ej: de '#proyectos' obtenemos 'proyectos'
      const targetId = link.getAttribute('href').substring(1); 

      // 2. Ocultamos todo: quitamos la clase 'active' de todos los enlaces y secciones.
      navLinks.forEach(item => item.classList.remove('active'));
      contentSections.forEach(section => section.classList.remove('active'));

      // 3. Mostramos lo correcto: añadimos la clase 'active' solo al enlace clickeado
      // y a la sección de contenido correspondiente.
      link.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
});