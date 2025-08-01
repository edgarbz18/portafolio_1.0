// Se ejecuta cuando el HTML ha sido completamente cargado y parseado.
document.addEventListener('DOMContentLoaded', () => {

  // --- LÓGICA DEL MENÚ DE NAVEGACIÓN ---
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');
  const toggleButton = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');

  // Evento para los enlaces del menú (Inicio, Sobre mí, etc.)
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);

      navLinks.forEach(item => item.classList.remove('active'));
      contentSections.forEach(section => section.classList.remove('active'));

      link.classList.add('active');
      document.getElementById(targetId).classList.add('active');

      // Si el menú hamburguesa está activo, lo cerramos al seleccionar una opción
      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
      }
    });
  });

  // Evento para el botón de menú hamburguesa
  toggleButton.addEventListener('click', () => {
    navList.classList.toggle('active');
  });


  // --- LÓGICA DEL MODAL Y LA API DE NOTICIAS ---
  const modal = document.getElementById('newsModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalQuote = document.getElementById('modalQuote'); // Asumimos que la API no da citas, lo dejaremos vacío.
  const modalText = document.getElementById('modalText');
  const closeModalBtn = document.querySelector('.close-modal');
  const blogContainer = document.getElementById('card-blog');

  // Reemplaza 'TU_API_KEY' con la clave que obtuviste de GNews.
  const apiKey = '994ec1e2ed619f93ebdb3fdd061e270a'; 
  // Buscamos artículos en español sobre tecnología O inversiones.
  const query = 'tecnología OR inversiones'; 
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=es&country=mx&max=10&apikey=${apiKey}`;

  // Función para cargar las noticias
  async function fetchNews() {
    // Mostramos un mensaje de carga mientras se obtienen los datos.
    blogContainer.innerHTML = '<p>Cargando noticias...</p>';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Limpiamos el contenedor antes de añadir las noticias nuevas.
      blogContainer.innerHTML = ''; 

      // Verificamos si hay artículos
      if (data.articles && data.articles.length > 0) {
        data.articles.forEach(article => {
          // Creamos la tarjeta para cada noticia
          const card = document.createElement('div');
          card.className = 'card';

          // ¡NUEVO! Guardamos la URL en el div de la tarjeta
          card.dataset.url = article.url;

          const title = article.title;
          const summary = article.description || 'Resumen no disponible.';
          const fullContent = article.content || 'Contenido completo no disponible.';
          const imageUrl = article.image || 'img/tecno.jpg'; // Una imagen por defecto si no viene
          const publishedDate = new Date(article.publishedAt).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
          });

          card.innerHTML = `
            <img src="${imageUrl}" alt="${title}" width="250px" class="img-blog">
            <h2>${title}</h2>
            <time datetime="${article.publishedAt}">${publishedDate}</time>
            <p class="resumen">${summary}</p>
            <button class="open-news-btn">Ver más</button>
            <div class="full-news-text" style="display: none;">${fullContent}</div>
          `;
          blogContainer.appendChild(card);
        });
      } else {
        blogContainer.innerHTML = '<p>No se encontraron noticias. Intenta más tarde.</p>';
      }

    } catch (error) {
      console.error("Error al cargar las noticias:", error);
      blogContainer.innerHTML = '<p>Hubo un error al cargar las noticias. Por favor, revisa la consola.</p>';
    }
  }

  // Llamamos a la función para que se ejecute al cargar la página
  fetchNews();

  // --- EVENTOS PARA EL MODAL (Usando delegación de eventos) ---
  const modalReadMoreBtn = document.getElementById('modalReadMoreBtn');
  // En lugar de añadir un listener a cada botón, lo añadimos al contenedor padre.
  // Esto funciona incluso para los botones creados dinámicamente.
  blogContainer.addEventListener('click', (event) => {
    // Si el elemento clickeado es un botón de "Ver más"
    if (event.target.classList.contains('open-news-btn')) {
      const card = event.target.closest('.card');
      
      // Obtenemos la información de la tarjeta
      const imgSrc = card.querySelector('img').src;
      const title = card.querySelector('h2').textContent;
      const date = card.querySelector('time').textContent;
      const fullText = card.querySelector('.full-news-text').textContent;

      // ¡NUEVO! Obtenemos la URL original que guardamos
      const originalUrl = card.dataset.url; 

      // Populamos el modal con la información
      modalImage.src = imgSrc;
      modalTitle.textContent = title;
      modalDate.textContent = date;
      modalQuote.textContent = ''; // Lo dejamos vacío
      modalText.textContent = fullText.split(' [')[0] + '...'; // GNews añade '[+...]' al final, lo quitamos.

      // ¡NUEVO! Asignamos la URL al botón "Leer noticia completa"
      modalReadMoreBtn.href = originalUrl;

      modal.classList.add('show');
    }
  });

  // Evento para cerrar el modal con el botón 'X'
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Evento para cerrar el modal haciendo clic fuera de él
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });
});