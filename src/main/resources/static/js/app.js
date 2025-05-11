document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const registerLink = document.getElementById('registerLink');
    const rateLink = document.getElementById('rateLink');
    const searchLink = document.getElementById('searchLink');
    const mapContainer = document.getElementById('map-container');

    // Modales
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const closeLoginModal = document.getElementById('closeLoginModal');

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

    // Abrir modal de registro
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.classList.remove('hidden');
    });

    // Abrir modal de login desde 'Valorar'
    rateLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isLoggedIn()) {
            loginModal.classList.remove('hidden');
        } else {
            rateModal.classList.remove('hidden');
        }
    });

    // Cerrar modales al pulsar la X
    closeRegisterModal.addEventListener('click', function() {
        registerModal.classList.add('hidden');
    });
    closeLoginModal.addEventListener('click', function() {
        loginModal.classList.add('hidden');
    });

    // Cerrar modales al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === registerModal) {
            registerModal.classList.add('hidden');
        }
        if (event.target === loginModal) {
            loginModal.classList.add('hidden');
        }
        if (event.target === rateModal) {
            rateModal.classList.add('hidden');
        }
    });

    // Navegación para "Tomar algo"
    searchLink.addEventListener('click', function(e) {
        e.preventDefault();
        mapContainer.classList.remove('hidden');
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

    // Función para saber si el usuario está logueado
    function isLoggedIn() {
        return !!localStorage.getItem('jwtToken');
    }

    // --- Registro ---
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        registerMessage.textContent = '';
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            registerMessage.style.color = '#388e3c';
            registerMessage.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            setTimeout(() => {
                registerModal.classList.add('hidden');
                registerForm.reset();
                registerMessage.textContent = '';
            }, 1500);
        })
        .catch(err => {
            registerMessage.style.color = '#d32f2f';
            registerMessage.textContent = 'Error: ' + (err.message || 'No se pudo registrar');
        });
    });

    // --- Login ---
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loginMessage.textContent = '';
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            localStorage.setItem('jwtToken', data.token);
            loginMessage.style.color = '#388e3c';
            loginMessage.textContent = '¡Login exitoso!';
            setTimeout(() => {
                loginModal.classList.add('hidden');
                loginForm.reset();
                loginMessage.textContent = '';
            }, 1000);
        })
        .catch(err => {
            loginMessage.style.color = '#d32f2f';
            loginMessage.textContent = 'Error: ' + (err.message || 'No se pudo iniciar sesión');
        });
    });

    // --- Valoración ---
    const rateModal = document.getElementById('rateModal');
    const closeRateModal = document.getElementById('closeRateModal');
    const rateForm = document.getElementById('rateForm');
    const rateMessage = document.getElementById('rateMessage');

    // Enviar valoración
    rateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        rateMessage.textContent = '';
        const productName = document.getElementById('rateProductName').value.trim();
        const placeName = document.getElementById('ratePlaceName').value.trim();
        const score = document.getElementById('rateScore').value;
        const comment = document.getElementById('rateComment').value.trim();
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            rateMessage.style.color = '#d32f2f';
            rateMessage.textContent = 'Debes iniciar sesión para valorar.';
            return;
        }

        // Buscar el producto por nombre y local
        fetch(`/api/products/search?name=${encodeURIComponent(productName)}&place=${encodeURIComponent(placeName)}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.json())
        .then(products => {
            if (!products || products.length === 0) {
                throw new Error('No se encontró el producto con ese nombre y local.');
            }
            // Tomamos el primer producto encontrado
            const product = products[0];
            // Enviar valoración
            return fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    productId: product.productId,
                    rating: parseInt(score),
                    comment: comment
                })
            });
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            rateMessage.style.color = '#388e3c';
            rateMessage.textContent = '¡Valoración enviada!';
            setTimeout(() => {
                rateModal.classList.add('hidden');
                rateForm.reset();
                rateMessage.textContent = '';
            }, 1500);
        })
        .catch(err => {
            rateMessage.style.color = '#d32f2f';
            rateMessage.textContent = 'Error: ' + (err.message || 'No se pudo enviar la valoración');
        });
    });
}); 