document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const registerLink = document.getElementById('registerLink');
    const rateLink = document.getElementById('rateLink');
    const searchLink = document.getElementById('searchLink');
    const mapContainer = document.getElementById('map-container');

    // Toggle del menú móvil
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Navegación
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Funcionalidad de registro en desarrollo');
    });

    rateLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Funcionalidad de valoración en desarrollo');
    });

    searchLink.addEventListener('click', function(e) {
        e.preventDefault();
        mapContainer.classList.remove('hidden');
        // Inicializar el mapa si aún no está inicializado
        if (typeof map === 'undefined') {
            initMap();
        }
    });

    // Botón de búsqueda
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value;
        const radius = document.getElementById('radiusInput').value;
        searchNearbyProducts(searchTerm, radius);
    });
}); 