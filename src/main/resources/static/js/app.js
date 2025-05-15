document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const registerLink = document.getElementById('registerLink');
    const rateLink = document.getElementById('rateLink');
    const searchLink = document.getElementById('searchLink');
    const mapContainer = document.getElementById('map-container');
    const homeLink = document.getElementById('homeLink');
    const logoutLink = document.getElementById('logoutLink');
    const registerPage = document.getElementById('registerPage');
    const loginPage = document.getElementById('loginPage');
    const heroSection = document.querySelector('.hero-section');
    const rateModal = document.getElementById('rateModal');
    const contributeLink = document.getElementById('contributeLink');
    const contributeModal = document.getElementById('contributeModal');
    const closeContributeModal = document.getElementById('closeContributeModal');
    const contributeForm = document.getElementById('contributeForm');
    const contributeMessage = document.getElementById('contributeMessage');

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

    // Mostrar/ocultar logout según login
    function updateAuthUI() {
        if (isLoggedIn()) {
            logoutLink.style.display = '';
        } else {
            logoutLink.style.display = 'none';
        }
    }
    updateAuthUI();

    // Navegación entre páginas
    function showPage(page) {
        // Oculta todas las secciones principales
        registerPage.classList.add('hidden');
        loginPage.classList.add('hidden');
        heroSection.classList.add('hidden');
        mapContainer.classList.add('hidden');
        rateModal.classList.add('hidden');
        contributeModal.classList.add('hidden');
        
        // Muestra la que toca
        if (page === 'register') registerPage.classList.remove('hidden');
        else if (page === 'login') loginPage.classList.remove('hidden');
        else if (page === 'map') mapContainer.classList.remove('hidden');
        else if (page === 'hero') heroSection.classList.remove('hidden');
        else if (page === 'contribute') contributeModal.classList.remove('hidden');
    }

    // Botón Inicio
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage('hero');
    });

    // Botón logout
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        updateAuthUI();
        showPage('hero');
    });

    // Mostrar página de registro
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage('register');
    });

    // Mostrar página de login
    rateLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isLoggedIn()) {
            showPage('login');
        } else {
            rateModal.classList.remove('hidden');
        }
    });

    // Mostrar mapa
    searchLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPage('map');
        if (typeof map === 'undefined') {
            initMap();
        }
    });

    // Cerrar modal de valoración
    const closeRateModal = document.getElementById('closeRateModal');
    closeRateModal.addEventListener('click', function() {
        rateModal.classList.add('hidden');
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === rateModal) {
            rateModal.classList.add('hidden');
        }
    });

    // Botón de búsqueda
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function() {
        performSearch();
    });

    // Mostrar modal de contribución
    contributeLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isLoggedIn()) {
            showPage('login');
        } else {
            contributeModal.classList.remove('hidden');
        }
    });

    // Cerrar modal de contribución
    closeContributeModal.addEventListener('click', function() {
        contributeModal.classList.add('hidden');
    });

    // Cerrar modal de contribución al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === contributeModal) {
            contributeModal.classList.add('hidden');
        }
    });

    // Enviar contribución
    contributeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        contributeMessage.textContent = '';
        const drinkType = document.getElementById('contributeDrinkType').value;
        const price = document.getElementById('contributePrice').value;
        const placeName = document.getElementById('contributePlaceName').value.trim();
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            contributeMessage.style.color = '#d32f2f';
            contributeMessage.textContent = 'Debes iniciar sesión para contribuir.';
            return;
        }

        fetch('/api/products/contribute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                drinkType: drinkType,
                price: parseFloat(price),
                placeName: placeName
            })
        })
        .then(res => {
            if (res.ok) return res.json();
            return res.text().then(text => { throw new Error(text); });
        })
        .then(data => {
            contributeMessage.style.color = '#388e3c';
            contributeMessage.textContent = '¡Contribución enviada!';
            setTimeout(() => {
                contributeModal.classList.add('hidden');
                contributeForm.reset();
                contributeMessage.textContent = '';
            }, 1500);
        })
        .catch(err => {
            contributeMessage.style.color = '#d32f2f';
            contributeMessage.textContent = 'Error: ' + (err.message || 'No se pudo enviar la contribución');
        });
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
                showPage('login');
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
                showPage('hero');
                loginForm.reset();
                loginMessage.textContent = '';
                updateAuthUI();
            }, 1000);
        })
        .catch(err => {
            loginMessage.style.color = '#d32f2f';
            loginMessage.textContent = 'Error: ' + (err.message || 'No se pudo iniciar sesión');
        });
    });

    // --- Valoración ---
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

    // Cruz para cerrar la pantalla de registro
    const closeRegisterPage = document.getElementById('closeRegisterPage');
    if (closeRegisterPage) {
        closeRegisterPage.addEventListener('click', function() {
            showPage('hero');
        });
    }

    // Cruz para cerrar la pantalla de login
    const closeLoginPage = document.getElementById('closeLoginPage');
    if (closeLoginPage) {
        closeLoginPage.addEventListener('click', function() {
            showPage('hero');
        });
    }

    // Al cargar, mostrar la pantalla principal
    showPage('hero');
}); 